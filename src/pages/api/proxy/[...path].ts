import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL;

export const config = {
  api: {
    bodyParser: false, // Required for file upload proxying
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'BACKEND_URL not configured' });
  }

  const { path, ...queryParams } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path || '';

  // Build query string from remaining params
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else if (value !== undefined) {
      searchParams.append(key, value as string);
    }
  }
  const qs = searchParams.toString();
  const fullUrl = `${BACKEND_URL}/${targetPath}${qs ? `?${qs}` : ''}`;

  try {
    // Collect raw body for non-GET requests
    const bodyBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    // Build headers to forward
    const forwardHeaders: Record<string, string> = {};
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization as string;
    }
    if (req.headers['content-type']) {
      forwardHeaders['Content-Type'] = req.headers['content-type'] as string;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && bodyBuffer.length > 0) {
      fetchOptions.body = bodyBuffer;
    }

    const response = await fetch(fullUrl, fetchOptions);

    // Forward response status and headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const responseBody = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Bad gateway' });
  }
}
