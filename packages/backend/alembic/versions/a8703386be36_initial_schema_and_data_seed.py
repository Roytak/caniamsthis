"""Initial schema and data seed

Revision ID: a8703386be36
Revises:
Create Date: 2025-12-05 21:08:51.571771

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import json


# revision identifiers, used by Alembic.
revision: str = 'a8703386be36'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create tables and seed data."""
    # Drop all tables first to ensure a clean state
    op.execute("DROP TABLE IF EXISTS npc_spell_association, instance_npc_association, spells, npcs, instances CASCADE")

    # Create tables
    instances_table = op.create_table('instances',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('type', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    npcs_table = op.create_table('npcs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('is_boss', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    spells_table = op.create_table('spells',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('school', sa.String(), nullable=True),
        sa.Column('can_immune', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    instance_npc_association_table = op.create_table('instance_npc_association',
        sa.Column('instance_id', sa.Integer(), nullable=True),
        sa.Column('npc_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['instance_id'], ['instances.id'], ),
        sa.ForeignKeyConstraint(['npc_id'], ['npcs.id'], )
    )
    npc_spell_association_table = op.create_table('npc_spell_association',
        sa.Column('npc_id', sa.Integer(), nullable=True),
        sa.Column('spell_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['npc_id'], ['npcs.id'], ),
        sa.ForeignKeyConstraint(['spell_id'], ['spells.id'], )
    )

    with open("../../scripts/instances.json", "r") as f:
        data = json.load(f)

    instances = []
    npcs = []
    spells = []
    instance_npc_associations = []
    npc_spell_associations = []

    for instance_type, instances_data in data.items():
        for instance_name, instance_data in instances_data.items():
            instances.append(
                {
                    "id": instance_data["id"],
                    "name": instance_name,
                    "type": instance_type,
                }
            )
            for npc_data in instance_data["npcs"]:
                npcs.append(
                    {
                        "id": npc_data["id"],
                        "name": npc_data["name"],
                        "is_boss": npc_data.get("is_boss", False),
                    }
                )
                instance_npc_associations.append(
                    {
                        "instance_id": instance_data["id"],
                        "npc_id": npc_data["id"],
                    }
                )
                for spell_data in npc_data["spells"]:
                    # Prefer an explicit 'can_immune' flag in the JSON when present.
                    # Fall back to previous logic that looked at flags if absent.
                    can_immune_value = None
                    if "can_immune" in spell_data:
                        can_immune_value = bool(spell_data["can_immune"])
                    else:
                        can_immune_value = "Immune" not in spell_data.get("flags", [])

                    spells.append(
                        {
                            "id": spell_data["id"],
                            "name": spell_data["name"],
                            "school": spell_data.get("school"),
                            "can_immune": can_immune_value,
                        }
                    )
                    npc_spell_associations.append(
                        {
                            "npc_id": npc_data["id"],
                            "spell_id": spell_data["id"],
                        }
                    )

    # Remove duplicates
    instances = [dict(t) for t in {tuple(d.items()) for d in instances}]
    npcs = [dict(t) for t in {tuple(d.items()) for d in npcs}]
    spells = [dict(t) for t in {tuple(d.items()) for d in spells}]
    instance_npc_associations = [dict(t) for t in {tuple(d.items()) for d in instance_npc_associations}]
    npc_spell_associations = [dict(t) for t in {tuple(d.items()) for d in npc_spell_associations}]

    op.bulk_insert(instances_table, instances)
    op.bulk_insert(npcs_table, npcs)
    op.bulk_insert(spells_table, spells)
    op.bulk_insert(instance_npc_association_table, instance_npc_associations)
    op.bulk_insert(npc_spell_association_table, npc_spell_associations)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('npc_spell_association')
    op.drop_table('instance_npc_association')
    op.drop_table('spells')
    op.drop_table('npcs')
    op.drop_table('instances')
