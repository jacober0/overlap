from pathlib import Path
from pglast import parse_sql  # type: ignore[import-not-found]

migration_dir = Path(__file__).resolve().parents[1] / "supabase" / "migrations"
files = sorted(migration_dir.glob("*.sql"))
if not files:
    raise SystemExit("Keine Supabase-Migrationen gefunden")

statement_count = 0
for path in files:
    sql = path.read_text(encoding="utf-8")
    parsed = parse_sql(sql)
    statement_count += len(parsed)
    print(f"{path.name}: OK ({len(parsed)} Statements)")

print(f"SQL validation passed: {len(files)} migration(s), {statement_count} statements")
