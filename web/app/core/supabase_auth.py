import os
from functools import lru_cache

import requests
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, jwk

security = HTTPBearer()


def _get_supabase_settings() -> tuple[str | None, str, str | None, str | None]:
    supabase_url = os.getenv("SUPABASE_URL")
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    jwks_url = os.getenv("SUPABASE_JWKS_URL")
    audience = os.getenv("SUPABASE_JWT_AUDIENCE")
    issuer = os.getenv("SUPABASE_JWT_ISSUER")

    if not issuer and supabase_url:
        issuer = f"{supabase_url.rstrip('/')}/auth/v1"

    if not audience:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_AUDIENCE is not configured.",
        )
    if not issuer:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_ISSUER (or SUPABASE_URL) is not configured.",
        )

    return jwt_secret, audience, issuer, jwks_url or (f"{supabase_url.rstrip('/')}/auth/v1/keys" if supabase_url else None)


@lru_cache(maxsize=1)
def _fetch_jwks(jwks_url: str) -> dict:
    response = requests.get(jwks_url, timeout=5)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch Supabase JWKS.")
    return response.json()


def _decode_with_jwks(token: str, jwks_url: str, audience: str, issuer: str) -> dict:
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="Invalid token header.")

    jwks = _fetch_jwks(jwks_url)
    keys = jwks.get("keys", [])
    key_data = next((key for key in keys if key.get("kid") == kid), None)
    if not key_data:
        raise HTTPException(status_code=401, detail="Invalid token key.")

    key = jwk.construct(key_data)
    return jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        audience=audience,
        issuer=issuer,
    )


def core_verify_supabase_token(id_token: str) -> dict:
    try:
        jwt_secret, audience, issuer, jwks_url = _get_supabase_settings()

        if jwt_secret:
            return jwt.decode(
                id_token,
                jwt_secret,
                algorithms=["HS256"],
                audience=audience,
                issuer=issuer,
            )

        if not jwks_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="SUPABASE_JWKS_URL (or SUPABASE_URL) is not configured.",
            )

        return _decode_with_jwks(id_token, jwks_url, audience, issuer)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


async def get_supabase_decoded(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    return core_verify_supabase_token(credentials.credentials)
