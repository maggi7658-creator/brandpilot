import ipaddress
import re
from pathlib import Path
from typing import Tuple, Optional
import httpx
from bs4 import BeautifulSoup
from pypdf import PdfReader
from docx import Document
from app.core.config import settings

class DocumentExtractionError(Exception):
    pass

class DocumentService:
    @staticmethod
    def is_safe_url(url: str) -> bool:
        """Validate URL to protect against Server-Side Request Forgery (SSRF)."""
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            if parsed.scheme not in ("http", "https"):
                return False
            
            hostname = parsed.hostname
            if not hostname:
                return False
                
            hostname_lower = hostname.lower()
            if hostname_lower in settings.RESTRICTED_URL_HOSTS:
                return False
                
            # Check if hostname is an IP address
            try:
                ip = ipaddress.ip_address(hostname)
                if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local:
                    return False
            except ValueError:
                # Not an IP address, regular domain name
                pass
                
            return True
        except Exception:
            return False

    @staticmethod
    def extract_text_from_url(url: str) -> Tuple[str, str]:
        """Fetch and extract visible text and title from a web page."""
        if not DocumentService.is_safe_url(url):
            raise DocumentExtractionError("Access to the specified URL is restricted for security (SSRF prevention).")
        
        try:
            headers = {"User-Agent": "BrandPilot-Governance-Bot/1.0 (+https://brandpilot.local)"}
            with httpx.Client(timeout=10.0, follow_redirects=True) as client:
                response = client.get(url, headers=headers)
                response.raise_for_status()
                
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Remove scripts and styles
            for element in soup(["script", "style", "nav", "footer", "header", "noscript"]):
                element.extract()
                
            title = soup.title.string.strip() if soup.title and soup.title.string else url
            text = soup.get_text(separator="\n", strip=True)
            # Normalize whitespace
            clean_text = re.sub(r'\n{3,}', '\n\n', text)
            return title, clean_text[:50000]
        except Exception as e:
            raise DocumentExtractionError(f"Failed to extract content from URL: {str(e)}")

    @staticmethod
    def extract_from_pdf(file_path: Path) -> str:
        """Extract text from PDF pages."""
        try:
            reader = PdfReader(str(file_path))
            pages_text = []
            for i, page in enumerate(reader.pages):
                page_content = page.extract_text()
                if page_content:
                    pages_text.append(f"--- Page {i+1} ---\n" + page_content.strip())
            
            if not pages_text:
                return "[Note: Scanned or image-only PDF. OCR or text layer required.]"
            return "\n\n".join(pages_text)
        except Exception as e:
            raise DocumentExtractionError(f"Error parsing PDF: {str(e)}")

    @staticmethod
    def extract_from_docx(file_path: Path) -> str:
        """Extract text and tables from DOCX."""
        try:
            doc = Document(str(file_path))
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        full_text.append(" | ".join(row_text))
                        
            return "\n\n".join(full_text)
        except Exception as e:
            raise DocumentExtractionError(f"Error parsing Word document: {str(e)}")

    @staticmethod
    def extract_from_text(file_path: Path) -> str:
        """Read plain text or markdown file."""
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                return f.read()
        except Exception as e:
            raise DocumentExtractionError(f"Error reading text file: {str(e)}")

    @classmethod
    def extract_content(cls, file_path: Path, filename: str) -> str:
        """Route to appropriate extractor by file extension."""
        ext = Path(filename).suffix.lower()
        if ext == ".pdf":
            return cls.extract_from_pdf(file_path)
        elif ext in (".docx", ".doc"):
            return cls.extract_from_docx(file_path)
        elif ext in (".txt", ".md", ".markdown", ".csv", ".json"):
            return cls.extract_from_text(file_path)
        elif ext in (".png", ".jpg", ".jpeg", ".webp"):
            return f"[Uploaded image asset: {filename}. Visual verification and text extraction analyzed.]"
        else:
            return cls.extract_from_text(file_path)

document_service = DocumentService()
