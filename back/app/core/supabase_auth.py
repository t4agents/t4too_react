import time
import logging
import requests
from jose import jwt, jwk
from jose.exceptions import JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import get_settings_singleton

settings = get_settings_singleton()
security = HTTPBearer()
logger = logging.getLogger("app.auth")

_JWKS_CACHE = {"expires_at": 0.0, "keys": []}


def _supabase_url() -> str:
    url = (settings.SUPABASE_URL or "").strip().rstrip("/")
    if not url:
        raise HTTPException(status_code=500, detail="SUPABASE_URL is not configured")
    return url


def _issuer() -> str:
    issuer = (settings.SUPABASE_JWT_ISSUER or "").strip().rstrip("/")
    if issuer:
        return issuer
    return f"{_supabase_url()}/auth/v1"


def _audience() -> str:
    aud = (settings.SUPABASE_JWT_AUD or "").strip()
    return aud or "authenticated"


def _get_jwks() -> list[dict]:
    now = time.time()
    if _JWKS_CACHE["keys"] and now < _JWKS_CACHE["expires_at"]:
        return _JWKS_CACHE["keys"]

    jwks_url = f"{_issuer()}/.well-known/jwks.json"
    try:
        resp = requests.get(jwks_url, timeout=5)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch Supabase JWKS")

    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch Supabase JWKS")

    data = resp.json()
    keys = data.get("keys") or []

    _JWKS_CACHE["keys"] = keys
    _JWKS_CACHE["expires_at"] = now + 600  # 10 minutes
    return keys


def core_verify_firebase_token(id_token: str):
    try:
        unverified_header = jwt.get_unverified_header(id_token)
        kid = unverified_header.get("kid")
        alg = unverified_header.get("alg")

        if not kid or not alg:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        keys = _get_jwks()
        jwk_key = next((k for k in keys if k.get("kid") == kid), None)
        if not jwk_key:
            _JWKS_CACHE["expires_at"] = 0
            keys = _get_jwks()
            jwk_key = next((k for k in keys if k.get("kid") == kid), None)
        if not jwk_key:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        public_key = jwk.construct(jwk_key).to_pem()
        decoded = jwt.decode(
            id_token,
            public_key,
            algorithms=[alg],
            audience=_audience(),
            issuer=_issuer(),
        )
        uid = decoded.get("uid") or decoded.get("user_id") or decoded.get("sub")
        logger.info("JWT verified: uid=%s aud=%s iss=%s", uid, decoded.get("aud"), decoded.get("iss"))
        return decoded

    except JWTError as e:
        logger.info("JWT verify failed: %s", str(e))
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


async def get_firebase_decoded(credentials: HTTPAuthorizationCredentials = Depends(security),) -> dict:
    return core_verify_firebase_token(credentials.credentials)


