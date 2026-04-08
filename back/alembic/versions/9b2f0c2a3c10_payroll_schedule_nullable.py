"""payroll_schedule_nullable

Revision ID: 9b2f0c2a3c10
Revises: 730c8eb0796f
Create Date: 2026-03-11 23:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9b2f0c2a3c10"
down_revision: Union[str, Sequence[str], None] = "730c8eb0796f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column("payroll_schedules", "weekday", existing_type=sa.String(), nullable=True)
    op.alter_column("payroll_schedules", "monthday", existing_type=sa.Integer(), nullable=True)
    op.alter_column("payroll_schedules", "semimonthday1", existing_type=sa.Integer(), nullable=True)
    op.alter_column("payroll_schedules", "semimonthday2", existing_type=sa.Integer(), nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column("payroll_schedules", "semimonthday2", existing_type=sa.Integer(), nullable=False)
    op.alter_column("payroll_schedules", "semimonthday1", existing_type=sa.Integer(), nullable=False)
    op.alter_column("payroll_schedules", "monthday", existing_type=sa.Integer(), nullable=False)
    op.alter_column("payroll_schedules", "weekday", existing_type=sa.String(), nullable=False)
