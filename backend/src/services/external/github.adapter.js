import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
});

// Add auth header lazily so env can load
api.interceptors.request.use((config) => {
  const token = process.env.GITHUB_API_TOKEN;
  if (token && !token.includes('xxxxx')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/vnd.github.v3+json';
  config.headers['User-Agent'] = 'RepoChatter-App';
  return config;
});

export function parseRepoUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') throw new Error('Not a GitHub URL');
    
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) throw new Error('Invalid GitHub repo URL');
    
    const owner = parts[0];
    const name = parts[1].replace('.git', '');
    return { owner, name, slug: `${owner}/${name}` };
  } catch (err) {
    throw new Error('Invalid repository URL provided.');
  }
}

export async function fetchReadme(owner, name) {
  try {
    const res = await api.get(`/repos/${owner}/${name}/readme`);
    // GitHub returns base64 encoded content
    const content = Buffer.from(res.data.content, 'base64').toString('utf8');
    return content;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('README not found for this repository.');
    }
    if (err.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded.');
    }
    throw new Error('Failed to fetch README from GitHub.');
  }
}

export async function fetchRecentCommits(owner, name, since = null) {
  try {
    const params = { per_page: 20 };
    if (since) {
      params.since = since instanceof Date ? since.toISOString() : new Date(since).toISOString();
    }

    const res = await api.get(`/repos/${owner}/${name}/commits`, { params });
    
    return res.data.map(commitObj => ({
      hash: commitObj.sha,
      authorName: commitObj.commit.author.name,
      authorEmail: commitObj.commit.author.email,
      message: commitObj.commit.message.split('\n')[0], // First line only
      committedAt: commitObj.commit.author.date,
    }));
  } catch (err) {
    console.error(`[GitHub] Failed to fetch commits for ${owner}/${name}`, err.message);
    return [];
  }
}
