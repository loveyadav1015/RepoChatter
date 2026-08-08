# Database Setup — Repo Chatter

## Prerequisites
- PostgreSQL 12+
- `pgvector` extension

*(Note: If you are on Arch Linux, install pgvector using `sudo pacman -S pgvector` before continuing.)*

## Steps
1. Create database: `createdb -U postgres repo_chatter`
2. Enable pgvector: `psql -U postgres -d repo_chatter -c "CREATE EXTENSION vector;"`
3. Run migrations in order:
   ```bash
   psql -U postgres -d repo_chatter -f database/migrations/001_init_tracked_repos.sql
   psql -U postgres -d repo_chatter -f database/migrations/002_init_repo_chunks.sql
   psql -U postgres -d repo_chatter -f database/migrations/003_init_commit_logs.sql
   psql -U postgres -d repo_chatter -f database/migrations/004_init_chat_history.sql
   ```
4. Verify: `psql -U postgres -d repo_chatter -c "\dt"`

## Testing the Schema
- Insert a test repo:
  ```sql
  INSERT INTO tracked_repos (repo_url, repo_name, owner, repo_slug)
  VALUES ('https://github.com/example/repo', 'repo', 'example', 'example/repo');
  ```
- Verify it exists:
  ```bash
  psql repo_chatter -c "SELECT * FROM tracked_repos;"
  ```
