import * as reposService from '../services/repos.service.js';
import { queryRAG, ingestReadme } from '../rag/index.js';

export async function addRepo(req, res, next) {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
    
    const repo = await reposService.addRepo(repoUrl);

    // MUST be awaited — if this throws, the client needs to know ingestion failed
    try {
      await ingestReadme(repo.id, repo.owner, repo.repo_name);
    } catch (ingestErr) {
      console.error('[addRepo] Ingestion failed for repo', repo.id, ingestErr.message);
      return res.status(201).json({
        ...repo,
        warning: 'Repository added but README indexing failed. Chat may not work yet.'
      });
    }

    // Re-fetch the repo so the response includes updated readme_content/last_embedded
    const updatedRepo = await reposService.getRepoDetails(repo.id);
    res.status(201).json(updatedRepo);
  } catch (err) {
    console.error('[addRepo] Failed:', err.message);
    res.status(500).json({ message: 'Failed to add repository', error: err.message });
  }
}

export async function listRepos(req, res, next) {
  try {
    const repos = await reposService.listRepos();
    res.json(repos);
  } catch (err) {
    next(err);
  }
}

export async function getRepoDetails(req, res, next) {
  try {
    const details = await reposService.getRepoDetails(req.params.id);
    res.json(details);
  } catch (err) {
    next(err);
  }
}

export async function removeRepo(req, res, next) {
  try {
    await reposService.removeRepo(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function chatWithRepo(req, res, next) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required' });
    
    const result = await queryRAG(req.params.id, question);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
