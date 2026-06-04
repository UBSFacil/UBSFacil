from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Adicionar o caminho do backend ao sys.path
backend_path = str(Path(__file__).parent.parent.parent / 'backend')
sys.path.insert(0, backend_path)

# Load environment variables
load_dotenv(Path(backend_path).parent / '.env')

# Import Base and force model loading
from app.database import Base
from app.models import models  # força o carregamento dos models pro autogenerate funcionar

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    url = os.getenv("DATABASE_URL")
    if url:
        configuration = config.get_section(config.config_ini_section)
        configuration["sqlalchemy.url"] = url
        connectable = engine_from_config(configuration, prefix="sqlalchemy.", poolclass=pool.NullPool)

        with connectable.connect() as connection:
            context.configure(connection=connection, target_metadata=target_metadata)

            with context.begin_transaction():
                context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
