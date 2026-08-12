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

    // Normal case: GitHub returns base64-encoded content inline
    if (res.data.encoding === 'base64' && res.data.content) {
      return Buffer.from(res.data.content, 'base64').toString('utf8');
    }

    // Large file case: GitHub omits inline content, provides a download_url instead
    if (res.data.download_url) {
      const raw = await axios.get(res.data.download_url, { responseType: 'text' });
      return raw.data;
    }

    // Neither content nor download_url present — genuinely unexpected response shape
    throw new Error('README response had no usable content or download_url.');
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('README not found for this repository.');
    }
    if (err.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded.');
    }
    // Log and surface the REAL underlying error instead of a generic message —
    // this is what was hiding the actual TypeError from Buffer.from(undefined, ...)
    console.error(`[GitHub] fetchReadme unexpected error for ${owner}/${name}:`, err.message);
    throw new Error(`Failed to fetch README from GitHub: ${err.message}`);
  }
}

export async function fetchRecentCommits(owner, name, since = null, maxCommits = 100) {
  const allCommits = [];
  let page = 1;
  const perPage = 100; // GitHub's max allowed per_page

  while (allCommits.length < maxCommits) {
    const params = { per_page: perPage, page };
    if (since) {
      params.since = since instanceof Date ? since.toISOString() : new Date(since).toISOString();
    }

    try {
      const response = await api.get(`/repos/${owner}/${name}/commits`, { params });

      if (response.data.length === 0) break; // no more commits, stop paginating

      allCommits.push(...response.data.map(commitObj => ({
        hash: commitObj.sha,
        authorName: commitObj.commit.author.name,
        authorEmail: commitObj.commit.author.email,
        message: commitObj.commit.message.split('\n')[0], // First line only
        committedAt: commitObj.commit.author.date,
      })));

      if (response.data.length < perPage) break; // last page reached
      page++;
    } catch (err) {
      console.error(`[GitHub] Failed to fetch commits for ${owner}/${name}`, err.message);
      break;
    }
  }

  return allCommits.slice(0, maxCommits);
}
