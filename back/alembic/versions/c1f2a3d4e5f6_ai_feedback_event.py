"""ai_feedback_event

Revision ID: c1f2a3d4e5f6
Revises: 8cc196b2c58f
Create Date: 2026-04-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "c1f2a3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "8cc196b2c58f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "ai_feedback_event",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("ten_id", sa.Uuid(), nullable=True),
        sa.Column("biz_id", sa.Uuid(), nullable=True),
        sa.Column("user_id", sa.Uuid(), nullable=True),
        sa.Column("session_id", sa.Uuid(), nullable=True),
        sa.Column("message_id", sa.Uuid(), nullable=True),
        sa.Column("route", sa.Text(), nullable=True),
        sa.Column("model", sa.Text(), nullable=True),
        sa.Column("feedback_type", sa.Text(), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("context", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("meta", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ai_feedback_event_biz_id"), "ai_feedback_event", ["biz_id"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_feedback_type"), "ai_feedback_event", ["feedback_type"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_message_id"), "ai_feedback_event", ["message_id"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_model"), "ai_feedback_event", ["model"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_route"), "ai_feedback_event", ["route"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_session_id"), "ai_feedback_event", ["session_id"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_ten_id"), "ai_feedback_event", ["ten_id"], unique=False)
    op.create_index(op.f("ix_ai_feedback_event_user_id"), "ai_feedback_event", ["user_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_ai_feedback_event_user_id"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_ten_id"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_session_id"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_route"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_model"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_message_id"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_feedback_type"), table_name="ai_feedback_event")
    op.drop_index(op.f("ix_ai_feedback_event_biz_id"), table_name="ai_feedback_event")
    op.drop_table("ai_feedback_event")
