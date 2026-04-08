"""t4 user

Revision ID: 7ac0f8da75fc
Revises: 9f2c5fd1da75
Create Date: 2026-02-13 17:54:58.374516

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7ac0f8da75fc'
down_revision: Union[str, Sequence[str], None] = '9f2c5fd1da75'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
