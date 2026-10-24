import hashlib
import os
import hmac
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Dict
import jwt
from app.core.config import settings

# User Roles enum-like constants
ROLE_CREATOR = "CREATOR"
ROLE_REVIEWER = "REVIEWER"
ROLE_LEGAL = "LEGAL"
ROLE_ADMIN = "ADMIN"

ALL_ROLES = [ROLE_CREATOR, ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN]

def hash_password(password: str) -> str:
    """Securely hash password using PBKDF2 HMAC SHA-256 with random salt."""
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return f"{salt}:{key}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verify password against stored salt:hash."""
    try:
        parts = stored_hash.split(":")
        if len(parts) != 2:
            return False
        salt, key = parts
        new_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()
        return hmac.compare_digest(key, new_key)
    except Exception:
        return False

def create_access_token(subject: str, role: str, workspace_id: Optional[str] = None, expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": subject,
        "role": role,
        "workspace_id": workspace_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
