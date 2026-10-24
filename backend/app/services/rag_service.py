import re
import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import Guideline, GuidelinePassage

class RetrievedEvidence:
    def __init__(
        self,
        guideline_id: str,
        guideline_title: str,
        passage_id: str,
        passage_text: str,
        section: Optional[str],
        version: str,
        authority: str,
        effective_date: str,
        score: float
    ):
        self.guideline_id = guideline_id
        self.guideline_title = guideline_title
        self.passage_id = passage_id
        self.passage_text = passage_text
        self.section = section
        self.version = version
        self.authority = authority
        self.effective_date = effective_date
        self.score = score

    def to_dict(self) -> Dict[str, Any]:
        return {
            "guideline_id": self.guideline_id,
            "guideline_title": self.guideline_title,
            "passage_id": self.passage_id,
            "passage_text": self.passage_text,
            "section": self.section,
            "version": self.version,
            "authority": self.authority,
            "effective_date": self.effective_date,
            "score": round(self.score, 3)
        }

class RAGService:
    @staticmethod
    def chunk_document(content: str, max_chunk_chars: int = 600) -> List[Dict[str, Any]]:
        """Split a guideline document into meaningful semantic passages with section awareness."""
        lines = content.splitlines()
        chunks = []
        current_section = "General"
        current_text = []

        def flush_current():
            nonlocal current_text
            text = " ".join(current_text).strip()
            if text:
                chunks.append({"section": current_section, "text": text})
            current_text = []

        for line in lines:
            line_str = line.strip()
            if not line_str:
                flush_current()
                continue
            if line_str.startswith("#"):
                flush_current()
                current_section = line_str.lstrip("#").strip()
            else:
                current_text.append(line_str)
                if sum(len(x) for x in current_text) >= max_chunk_chars:
                    flush_current()

        flush_current()
        return chunks

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        words = re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', text.lower())
        stopwords = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
            "with", "by", "from", "as", "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "do", "does", "did", "our", "we", "you", "your", "they",
            "it", "its", "that", "this", "these", "those"
        }
        return [w for w in words if w not in stopwords]

    @classmethod
    def retrieve_relevant_passages(
        cls,
        db: Session,
        workspace_id: str,
        query: str,
        top_k: int = 3,
        min_threshold: float = 0.15
    ) -> List[RetrievedEvidence]:
        """Retrieve authoritative passages from approved guidelines matching query."""
        guidelines = db.query(Guideline).filter(
            Guideline.workspace_id == workspace_id,
            Guideline.is_active == True
        ).all()
        
        if not guidelines:
            return []

        query_tokens = set(cls._tokenize(query))
        if not query_tokens:
            return []

        results: List[RetrievedEvidence] = []

        for g in guidelines:
            for p in g.passages:
                passage_tokens = cls._tokenize(p.passage_text)
                if not passage_tokens:
                    continue
                
                # Token overlap / Jaccard-TF score
                intersection = query_tokens.intersection(passage_tokens)
                if not intersection:
                    continue
                    
                score = len(intersection) / (math.sqrt(len(query_tokens)) * math.sqrt(len(passage_tokens)))
                
                # Keyword booster for exact key phrase matches
                for q_word in query_tokens:
                    if q_word in p.passage_text.lower():
                        score += 0.05
                        
                if score >= min_threshold:
                    results.append(
                        RetrievedEvidence(
                            guideline_id=g.id,
                            guideline_title=g.title,
                            passage_id=p.id,
                            passage_text=p.passage_text,
                            section=p.section,
                            version=g.version,
                            authority=g.authority,
                            effective_date=g.effective_date,
                            score=score
                        )
                    )

        # Sort descending by score
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:top_k]

rag_service = RAGService()
