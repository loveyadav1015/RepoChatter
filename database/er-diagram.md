```mermaid
erDiagram
    tracked_repos ||--o{ repo_chunks : "has many"
    tracked_repos ||--o{ commit_logs : "has many"
    tracked_repos ||--o{ chat_history : "has many"

    tracked_repos {
        UUID id PK
        VARCHAR repo_url UK
        VARCHAR repo_name
        VARCHAR owner
        VARCHAR repo_slug
        TEXT readme_content
        TIMESTAMP last_fetched
        TIMESTAMP last_embedded
        INT commit_count
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    repo_chunks {
        UUID id PK
        UUID repo_id FK
        INT chunk_index
        TEXT chunk_text
        VARCHAR source_section
        vector embedding
        TIMESTAMP embedded_at
        TIMESTAMP created_at
    }

    commit_logs {
        UUID id PK
        UUID repo_id FK
        VARCHAR commit_hash
        VARCHAR author_name
        VARCHAR author_email
        TEXT commit_message
        TIMESTAMP committed_at
        TIMESTAMP fetched_at
    }

    chat_history {
        UUID id PK
        UUID repo_id FK
        TEXT user_question
        TEXT assistant_answer
        UUID[] source_chunk_ids
        TIMESTAMP created_at
    }
```

### Table Details

**tracked_repos:**
- Stores metadata about repos being tracked
- `last_fetched`: When README was last pulled
- `last_embedded`: When chunks were last embedded

**repo_chunks:**
- Stores README chunks + their embeddings
- Used for similarity search during RAG

**commit_logs:**
- Stores recent commits fetched by cron
- For displaying repo activity on the frontend
- Unique constraint prevents duplicates

**chat_history:**
- Optional: log of Q&A for the UI
- `source_chunk_ids`: Shows which README parts were used
