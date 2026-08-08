import * as reposService from '../services/repos.service.js';
import { queryRAG } from '../rag/index.js';

export async function addRepo(req, res, next) {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
    
    const repo = await reposService.addRepo(repoUrl);
    res.status(201).json(repo);
  } catch (err) {
    next(err);
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
