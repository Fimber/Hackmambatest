# Make Your First API Call with Axios

Use Axios to fetch data and send JSON requests in any JavaScript project. It parses JSON automatically, throws on non-2xx responses, and lets you set base URLs and headers once—with less boilerplate than the built-in `fetch`.

## Prerequisites

Confirm you have:

- Node.js 18 or later (`node --version` to check)
- npm
- A code editor
- Working knowledge of `async`/`await`

## What you'll build

A set of small Node.js scripts that demonstrate:

1. A reusable local test server
2. A GET request that reads a user record
3. A POST request that creates a new post
4. A configured Axios instance with shared settings
5. An error-handling script that branches on failure type

## Step 1: Set up your project

```bash
mkdir axios-tutorial && cd axios-tutorial
npm init -y
npm install axios
```

Open `package.json` and add a `"type": "module"` line so ES module syntax works:

```json
{
  "name": "axios-tutorial",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "axios": "^1.16.0"
  }
}
```

**Expected output:** `package.json` exists with `axios` listed under dependencies and `"type": "module"` set. The install log ends with something like `added 23 packages`.

## Step 2: Run a local test server

Real APIs require auth or rate-limit you, so this tutorial uses a local server you control. Create `server.js`:

```js
import http from 'node:http';

const users = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
];
const posts = [];
let nextId = 1;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url.startsWith('/users/')) {
    const id = Number(req.url.split('/')[2]);
    const user = users.find((u) => u.id === id);
    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'User not found' }));
    }
    return res.end(JSON.stringify(user));
  }

  if (req.method === 'POST' && req.url === '/posts') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const post = { id: nextId++, ...JSON.parse(body) };
      posts.push(post);
      res.statusCode = 201;
      res.end(JSON.stringify(post));
    });
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
}).listen(3000, () => console.log('Server running at http://localhost:3000'));
```

Run it in one terminal:

```bash
node server.js
```

**Expected output:** `Server running at http://localhost:3000`. Leave this terminal open. All remaining steps run in a second terminal.

## Step 3: Send your first GET request

Create `get-request.js`:

```js
import axios from 'axios';

const response = await axios.get('http://localhost:3000/users/1');
console.log('Status:', response.status);
console.log('Data:', response.data);
```

Run it:

```bash
node get-request.js
```

**Expected output:**

```
Status: 200
Data: { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' }
```

Axios parses the JSON response automatically, so `response.data` is already a JavaScript object. With raw `fetch` you would have to call `.json()` on the response yourself.

Every Axios response carries the same shape:

| Property | Description |
|----------|-------------|
| `data` | The parsed response body |
| `status` | The HTTP status code |
| `headers` | Response headers |
| `config` | The settings used for the request |

## Step 4: Send a POST request with data

Create `post-request.js`:

```js
import axios from 'axios';

const response = await axios.post('http://localhost:3000/posts', {
  title: 'My first post',
  body: 'Learning Axios today',
  userId: 1,
});
console.log('Status:', response.status);
console.log('Created:', response.data);
```

Run it:

```bash
node post-request.js
```

**Expected output:**

```
Status: 201
Created: {
  id: 1,
  title: 'My first post',
  body: 'Learning Axios today',
  userId: 1
}
```

Axios sets `Content-Type: application/json` and serializes the object you pass in, so you do not have to call `JSON.stringify` or set headers by hand.

## Step 5: Configure a reusable client

For real projects, define base URL, timeout, and headers once. Create `api.js`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000, // milliseconds
  headers: { 'Content-Type': 'application/json' },
});

const { data } = await api.get('/users/2');
console.log('Data:', data);
```

Run it:

```bash
node api.js
```

**Expected output:**

```
Data: { id: 2, name: 'Alan Turing', email: 'alan@example.com' }
```

Subsequent calls only need the path. Per-call options merge on top of defaults, so you can override the timeout or add a header on a single request without touching the instance.

## Step 6: Handle errors

Use the configured instance and inspect the three branches of the error object. Create `error-handling.js`:

```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000', timeout: 5000 });

try {
  await api.get('/users/9999');
} catch (error) {
  if (error.response) {
    // Server returned a non-2xx status
    console.log('Server responded with:', error.response.status);
    console.log('Body:', error.response.data);
  } else if (error.request) {
    // Request sent, no response received (timeout, DNS failure, etc.)
    console.log('No response received:', error.message);
    console.log('Error code:', error.code); // e.g. 'ECONNREFUSED', 'ECONNABORTED'
  } else {
    // Something went wrong before the request left
    console.log('Request setup failed:', error.message);
  }
}
```

Run it:

```bash
node error-handling.js
```

**Expected output:**

```
Server responded with: 404
Body: { error: 'User not found' }
```

The three branches map to three failure modes:

| Branch | Triggered when |
|--------|----------------|
| `error.response` | Server returned a non-2xx status |
| `error.request` | Request sent, no response received (timeout, DNS failure, connection refused) |
| `else` | Request rejected before reaching the network (misconfiguration) |

In the `error.request` branch, `error.code` gives you a machine-readable string like `ECONNREFUSED` or `ECONNABORTED` (timeout). You can match on it to decide whether to retry.

## Next steps

This tutorial covered GET, POST, reusable instances, and error handling. A few things worth exploring next in the Axios docs:

- **PUT, PATCH, DELETE** work just like POST: `axios.put(url, data)`, `axios.patch(url, data)`, `axios.delete(url)`
- **Interceptors** let you run logic before every request or after every response—useful for attaching auth tokens or logging
- **Cancellation** with `AbortController` lets you cancel in-flight requests when a user navigates away
- **Concurrent requests** with `Promise.all([api.get('/a'), api.get('/b')])` fire multiple calls in parallel

## Troubleshooting

### Warning or error about import statement outside a module

Your `package.json` is missing `"type": "module"`. On Node 22 and newer you will see a `MODULE_TYPELESS_PACKAGE_JSON` warning and the code still runs. On Node 18 and 20 it throws `SyntaxError: Cannot use import statement outside a module`. Add `"type": "module"` to `package.json`, or rename the file to `.mjs`.

### Error: connect ECONNREFUSED 127.0.0.1:3000

The server is not running on the port you are calling. Run three checks:

1. Confirm `node server.js` is still running in its terminal
2. Confirm both files agree on the port (`3000` here)
3. Confirm the server process has not crashed

The `error.code` will be the string `ECONNREFUSED`, which you can match on programmatically if you want to retry connection failures.

### Request failed with status code 401 or 403

The API requires authentication you have not provided. Add an `Authorization` header:

```js
await api.get('/private', {
  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
});
```

Set the `API_TOKEN` environment variable before running your script (`export API_TOKEN=your-token` in the terminal, or use a `.env` file with `dotenv`). Never hardcode credentials in source files committed to Git.

## TypeScript example

```ts
// Interfaces describe the shape of an object.
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean; // optional property
}

function greet(user: User): string {
  const role = user.isAdmin ? 'admin' : 'member';
  return `Hello ${user.name}, you are signed in as a ${role}.`;
}

const ada: User = {
  id: 1,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  isAdmin: true,
};

console.log(greet(ada));

// A union type means "this value is one of these shapes."
type FetchResult =
  | { ok: true; data: User }
  | { ok: false; error: string };

// TypeScript narrows the type inside each branch automatically.
function handle(result: FetchResult): string {
  if (result.ok) {
    return `Got user: ${result.data.name}`;
  } else {
    return `Failed: ${result.error}`;
  }
}

console.log(handle({ ok: true, data: ada }));
console.log(handle({ ok: false, error: 'User not found' }));
```
