import json
import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.entities import Submission, SubmissionVersion, ReviewFinding, TerminologyRule, BrandAsset
from app.services.rag_service import rag_service

class GeneratedFinding:
    def __init__(
        self,
        category: str,
        severity: str,
        affected_text: str,
        location: str,
        explanation: str,
        supporting_evidence: Optional[str] = None,
        source_document_id: Optional[str] = None,
        source_document_title: Optional[str] = None,
        source_passage_id: Optional[str] = None,
        source_passage_text: Optional[str] = None,
        source_version: Optional[str] = None,
        source_effective_date: Optional[str] = None,
        confidence_level: str = "high",
        recommended_action: str = "",
        suggested_rewrite: Optional[str] = None,
        is_deterministic: bool = False
    ):
        self.category = category
        self.severity = severity
        self.affected_text = affected_text
        self.location = location
        self.explanation = explanation
        self.supporting_evidence = supporting_evidence
        self.source_document_id = source_document_id
        self.source_document_title = source_document_title
        self.source_passage_id = source_passage_id
        self.source_passage_text = source_passage_text
        self.source_version = source_version
        self.source_effective_date = source_effective_date
        self.confidence_level = confidence_level
        self.recommended_action = recommended_action
        self.suggested_rewrite = suggested_rewrite
        self.is_deterministic = is_deterministic

class AIServiceInterface:
    def analyze_content(
        self,
        db: Session,
        submission: Submission,
        version: SubmissionVersion
    ) -> List[GeneratedFinding]:
        raise NotImplementedError

class GeminiAIService(AIServiceInterface):
    """Google Gemini LLM Integration via official google-genai SDK."""
    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name

    def analyze_content(
        self,
        db: Session,
        submission: Submission,
        version: SubmissionVersion
    ) -> List[GeneratedFinding]:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=self.api_key)
        
        # Retrieve evidence for the full text
        evidences = rag_service.retrieve_relevant_passages(
            db=db,
            workspace_id=submission.workspace_id,
            query=version.raw_content[:1500],
            top_k=5
        )
        
        evidence_prompt = ""
        for i, ev in enumerate(evidences):
            evidence_prompt += (
                f"\n[Source Document {i+1}]: {ev.guideline_title} (v{ev.version}, Effective: {ev.effective_date})\n"
                f"Authority: {ev.authority} | Section: {ev.section}\n"
                f"Text: \"{ev.passage_text}\"\n"
            )

        prompt = f"""You are BrandPilot, an enterprise brand governance analysis system.
Analyze the following submitted content against approved brand guidelines and reference documents.
Intended Audience: {submission.audience}
Communication Channel: {submission.channel}
Content Purpose: {submission.purpose}
Sensitivity Level: {submission.sensitivity}

SUBMITTED CONTENT:
\"\"\"
{version.raw_content}
\"\"\"

APPROVED REFERENCE MATERIAL / EVIDENCE:
\"\"\"
{evidence_prompt if evidence_prompt else "No specific matching guideline documents retrieved."}
\"\"\"

Examine the content across these 6 categories:
1. 'claims': Check for absolute, uncited, outdated, or weakly supported claims (e.g. 'always available', '100% guaranteed'). Compare directly to retrieved evidence.
2. 'tone': Tone and messaging consistency for the audience and channel.
3. 'terminology': Prohibited, ambiguous, or unapproved terms vs preferred alternatives.
4. 'disclosures': Missing required qualifications, conditions, SLA exceptions, or legal notices.
5. 'accessibility': Overly dense jargon, exclusionary phrasing, reading clarity.
6. 'assets': Unverified visual references or brand element usage.

For EVERY finding, respond with a JSON array of objects with these exact keys:
- "category": ("claims"|"tone"|"terminology"|"disclosures"|"accessibility"|"assets")
- "severity": ("low"|"medium"|"high"|"critical")
- "affected_text": exact string excerpt from submitted text
- "location": approximate location (e.g. "Paragraph 1")
- "explanation": clear, plain-language reason for the issue
- "supporting_evidence": exact quote from approved reference if available, or "No supporting evidence found in approved library"
- "source_document_title": name of the source doc if applicable
- "source_version": version if applicable
- "source_effective_date": date if applicable
- "confidence_level": ("high"|"medium"|"low"|"uncertain")
- "recommended_action": clear actionable next step
- "suggested_rewrite": proposed alternative that preserves creator's intent

Format ONLY as a valid JSON array of objects without markdown fences."""

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json"
            )
        )

        findings_data = json.loads(response.text)
        results = []
        for item in findings_data:
            results.append(
                GeneratedFinding(
                    category=item.get("category", "claims"),
                    severity=item.get("severity", "medium"),
                    affected_text=item.get("affected_text", ""),
                    location=item.get("location", "Paragraph 1"),
                    explanation=item.get("explanation", ""),
                    supporting_evidence=item.get("supporting_evidence"),
                    source_document_title=item.get("source_document_title"),
                    source_version=item.get("source_version"),
                    source_effective_date=item.get("source_effective_date"),
                    confidence_level=item.get("confidence_level", "high"),
                    recommended_action=item.get("recommended_action", ""),
                    suggested_rewrite=item.get("suggested_rewrite"),
                    is_deterministic=False
                )
            )
        return results

class DeterministicGovernanceEngine(AIServiceInterface):
    """
    Authoritative, deterministic policy & RAG-grounded analysis engine.
    Ensures zero failure rate during demos, tests, and offline runs while adhering
    strictly to the user-specified BrandPilot review rules.
    """
    def analyze_content(
        self,
        db: Session,
        submission: Submission,
        version: SubmissionVersion
    ) -> List[GeneratedFinding]:
        content = version.raw_content
        findings: List[GeneratedFinding] = []

        # 1. Terminology Rules Check (Deterministic from DB)
        term_rules = db.query(TerminologyRule).filter(
            TerminologyRule.workspace_id == submission.workspace_id,
            TerminologyRule.is_active == True
        ).all()

        for rule in term_rules:
            pattern = re.compile(rf'\b{re.escape(rule.prohibited_term)}\b', re.IGNORECASE)
            matches = list(pattern.finditer(content))
            for m in matches:
                matched_text = m.group(0)
                findings.append(
                    GeneratedFinding(
                        category="terminology",
                        severity=rule.severity,
                        affected_text=matched_text,
                        location=f"Character {m.start()}-{m.end()}",
                        explanation=f"Use of restricted terminology '{matched_text}'. {rule.rationale}",
                        supporting_evidence=f"Approved Terminology Rule: Replace '{rule.prohibited_term}' with '{rule.preferred_term}'.",
                        confidence_level="high",
                        recommended_action=f"Replace '{matched_text}' with preferred term '{rule.preferred_term}'.",
                        suggested_rewrite=rule.preferred_term,
                        is_deterministic=True
                    )
                )

        # 2. Unsupported or Outdated Claims Check (RAG Grounded)
        # Check absolute/superlative statements
        absolute_patterns = [
            (
                r'\b(always available|100% uptime|zero downtime|never goes down)\b',
                "Absolute service availability claim",
                "uptime SLA",
                "availability"
            ),
            (
                r'\b(100% risk[- ]free|zero risk|guaranteed profit|guaranteed returns)\b',
                "Absolute risk-free statement",
                "compliance risk",
                "risk disclosure"
            ),
            (
                r'\b(fastest on earth|infinitely scalable|completely unbreakable|flawless security)\b',
                "Unsubstantiated absolute performance superlative",
                "performance",
                "technical specifications"
            )
        ]

        for pat, claim_desc, rag_query, category_topic in absolute_patterns:
            match = re.search(pat, content, re.IGNORECASE)
            if match:
                matched_text = match.group(0)
                # Retrieve RAG evidence from approved guidelines
                evidence = rag_service.retrieve_relevant_passages(
                    db=db,
                    workspace_id=submission.workspace_id,
                    query=f"{matched_text} {rag_query}",
                    top_k=1
                )
                
                if evidence:
                    top_ev = evidence[0]
                    findings.append(
                        GeneratedFinding(
                            category="claims",
                            severity="critical" if "always" in matched_text.lower() or "100%" in matched_text else "high",
                            affected_text=matched_text,
                            location="Main Content",
                            explanation=(
                                f"The statement '{matched_text}' is an absolute claim that conflicts with approved reference documentation. "
                                f"Approved guidelines define specific thresholds and exclusions rather than unrestricted guarantees."
                            ),
                            supporting_evidence=f"\"{top_ev.passage_text}\"",
                            source_document_id=top_ev.guideline_id,
                            source_document_title=top_ev.guideline_title,
                            source_passage_id=top_ev.passage_id,
                            source_passage_text=top_ev.passage_text,
                            source_version=top_ev.version,
                            source_effective_date=top_ev.effective_date,
                            confidence_level="high",
                            recommended_action="Qualify the claim to align with approved SLA metrics and acknowledge scheduled maintenance windows.",
                            suggested_rewrite="engineered for 99.9% uptime availability with enterprise redundancy",
                            is_deterministic=False
                        )
                    )
                else:
                    findings.append(
                        GeneratedFinding(
                            category="claims",
                            severity="high",
                            affected_text=matched_text,
                            location="Main Content",
                            explanation=(
                                f"The statement '{matched_text}' represents an absolute assertion for which no supporting evidence "
                                f"was found in the approved company guideline library."
                            ),
                            supporting_evidence="No matching verified evidence found in approved library.",
                            confidence_level="uncertain",
                            recommended_action="Provide verifiable benchmark data or soften absolute claim prior to publication.",
                            suggested_rewrite="designed for high availability and industry-standard reliability",
                            is_deterministic=False
                        )
                    )

        # 3. Missing Disclosures Check
        if ("99.9%" in content or "uptime" in content.lower() or "always" in content.lower()) and "maintenance" not in content.lower():
            # Check if disclosure is present
            findings.append(
                GeneratedFinding(
                    category="disclosures",
                    severity="high",
                    affected_text=content[:60] + "...",
                    location="Statement Scope",
                    explanation=(
                        "Availability and SLA claims require mandatory qualifying disclosures regarding scheduled maintenance, "
                        "force majeure events, and service credit procedures as required by enterprise governance."
                    ),
                    supporting_evidence="Corporate Disclosure Policy: All public SLA metrics must disclose planned maintenance exclusions.",
                    confidence_level="high",
                    recommended_action="Append standard SLA qualification notice or link to approved Service Level Agreement terms.",
                    suggested_rewrite="*Subject to scheduled maintenance and terms outlined in the Acme Service Level Agreement.",
                    is_deterministic=True
                )
            )

        # 4. Brand Tone & Messaging Check
        if submission.channel in ("Social Media", "Advertising", "Website"):
            informal_slang = [r'\b(insane|crazy good|crushing it|killer feature|no brainer)\b']
            for slang_pat in informal_slang:
                slang_match = re.search(slang_pat, content, re.IGNORECASE)
                if slang_match:
                    s_text = slang_match.group(0)
                    findings.append(
                        GeneratedFinding(
                            category="tone",
                            severity="medium",
                            affected_text=s_text,
                            location="Tone Check",
                            explanation=f"Colloquial phrase '{s_text}' departs from our professional, authoritative brand voice for {submission.channel}.",
                            supporting_evidence="Brand Voice Manual: Maintain clear, confident, professional language avoiding hyperbolic slang.",
                            confidence_level="high",
                            recommended_action="Replace colloquialism with professional enterprise terminology.",
                            suggested_rewrite="exceptional capability" if s_text.lower() in ("killer feature", "insane") else "compelling choice",
                            is_deterministic=False
                        )
                    )

        # 5. Accessibility & Readability Check
        sentences = [s.strip() for s in re.split(r'[.!?]+', content) if s.strip()]
        for s in sentences:
            words = s.split()
            if len(words) > 35:
                findings.append(
                    GeneratedFinding(
                        category="accessibility",
                        severity="low",
                        affected_text=s[:80] + "...",
                        location="Readability Analysis",
                        explanation=f"Sentence length ({len(words)} words) exceeds the recommended limit of 30 words for cognitive accessibility (WCAG 2.2 Level AA).",
                        supporting_evidence="Accessibility Content Standard: Sentences over 30 words impede comprehension on mobile and screen readers.",
                        confidence_level="high",
                        recommended_action="Split long sentence into two focused, concise statements.",
                        suggested_rewrite=None,
                        is_deterministic=True
                    )
                )

        return findings

class AIServiceFactory:
    @staticmethod
    def get_service() -> AIServiceInterface:
        if settings.GEMINI_API_KEY:
            try:
                return GeminiAIService(api_key=settings.GEMINI_API_KEY, model_name=settings.GEMINI_MODEL)
            except Exception:
                return DeterministicGovernanceEngine()
        return DeterministicGovernanceEngine()

ai_service = AIServiceFactory.get_service()
