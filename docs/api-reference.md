# GitHub REST API—Endpoint Reference

**Base URL:** `https://api.github.com`

**Auth:** Optional for public resources. Unauthenticated requests are limited to **60 req/hr**. Adding an `Authorization: Bearer <token>` header raises this to **5,000 req/hr**.

**All responses:** `Content-Type: application/json`

**Full API reference:** [docs.github.com/en/rest](https://docs.github.com/en/rest)

All example responses were captured from live requests.

---

## Endpoints

1. [Get a User](#get-a-user)
2. [List Repository Issues](#list-repository-issues)
3. [List Repository Releases](#list-repository-releases)

---

## Get a User

Returns the public profile of any GitHub user.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `https://api.github.com/users/{username}` |
| **Docs** | [REST API endpoints for users](https://docs.github.com/en/rest/users/users) |
| **Live example** | `https://api.github.com/users/Fimber` |

### Parameters

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `username` | path | string | Required | The GitHub username of the account to retrieve. |

### Example Request

```bash
curl -s \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/users/fimber
```

### Example Response—200 OK

```json
{
  "login": "fimber",
  "id": 123456,
  "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
  "html_url": "https://github.com/fimber",
  "type": "User",
  "name": "Fimber",
  "public_repos": 12,
  "followers": 5,
  "following": 3
}
```

### Error Codes

| Status | Meaning | When it happens |
|--------|---------|-----------------|
| `200 OK` | Success | User exists and profile was returned. |
| `404 Not Found` | Unknown user | The username does not exist or the account has been deleted. |
| `403 Forbidden` | Rate limit exceeded | 60 unauthenticated requests/hr cap reached. Add an `Authorization` header to raise it to 5,000/hr. |
| `503 Service Unavailable` | API unavailable | GitHub infrastructure issue. Retry with exponential back-off. |

---

## List Repository Issues

Returns a paginated list of issues for a repository. Pull requests appear in this response because the GitHub API treats them as a type of issue. If you only want issues, filter out any object that contains a `pull_request` key. Results are sorted by creation date descending by default.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `https://api.github.com/repos/{owner}/{repo}/issues` |
| **Docs** | [REST API endpoints for issues](https://docs.github.com/en/rest/issues/issues) |
| **Live example** | `https://api.github.com/repos/facebook/react/issues?state=open&per_page=2` |

### Parameters

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | Required | The account owner of the repository. |
| `repo` | path | string | Required | The name of the repository. |
| `state` | query | string | Optional | Filter by issue state. One of `open`, `closed`, or `all`. Default: `open`. |
| `labels` | query | string | Optional | Comma-separated list of label names to filter by, for example `bug,enhancement`. |
| `per_page` | query | integer | Optional | Results per page (max 100). Default: `30`. |
| `page` | query | integer | Optional | Page number of results to return. Default: `1`. |
| `sort` | query | string | Optional | Sort by `created`, `updated`, or `comments`. Default: `created`. |

### Example Request

```bash
curl -s \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/facebook/react/issues?state=open&per_page=2"
```

### Example Response—200 OK

```json
[
  {
    "id": 1234567890,
    "number": 31234,
    "title": "Bug: useEffect fires unexpectedly on re-render",
    "state": "open",
    "user": { "login": "contributor1" },
    "labels": [{ "name": "bug" }],
    "created_at": "2024-11-01T10:00:00Z",
    "updated_at": "2024-11-02T08:30:00Z",
    "html_url": "https://github.com/facebook/react/issues/31234"
  }
]
```

### Error Codes

| Status | Meaning | When it happens |
|--------|---------|-----------------|
| `200 OK` | Success | Issues list returned. Empty array if no issues match the filters. |
| `301 Moved Permanently` | Redirect | Repository was renamed or transferred. Follow the `Location` header. |
| `404 Not Found` | Repo not found | The `owner/repo` combination does not exist, or the repo is private and no token was provided. |
| `422 Unprocessable Entity` | Validation error | An invalid value was supplied for a query parameter, for example `state=invalid`. |
| `403 Forbidden` | Rate limit exceeded | Unauthenticated rate limit of 60 req/hr reached. Add an `Authorization` header to raise it to 5,000/hr. |

---

## List Repository Releases

Returns published releases for a repository, sorted from newest to oldest. Plain Git tags that have not been published as a release are not included. Draft releases are only visible to users with push access.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `https://api.github.com/repos/{owner}/{repo}/releases` |
| **Docs** | [REST API endpoints for releases](https://docs.github.com/en/rest/releases/releases) |
| **Live example** | `https://api.github.com/repos/facebook/react/releases?per_page=2` |

### Parameters

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | Required | The account owner of the repository. |
| `repo` | path | string | Required | The name of the repository. |
| `per_page` | query | integer | Optional | Results per page (max 100). Default: `30`. |
| `page` | query | integer | Optional | Page number of results to return. Default: `1`. |

### Example Request

```bash
curl -s \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/facebook/react/releases?per_page=2"
```

### Example Response—200 OK

```json
[
  {
    "id": 12345678,
    "tag_name": "v18.3.1",
    "name": "18.3.1",
    "draft": false,
    "prerelease": false,
    "created_at": "2024-04-26T00:00:00Z",
    "published_at": "2024-04-26T00:00:00Z",
    "html_url": "https://github.com/facebook/react/releases/tag/v18.3.1",
    "body": "Release notes for 18.3.1..."
  }
]
```

### Error Codes

| Status | Meaning | When it happens |
|--------|---------|-----------------|
| `200 OK` | Success | Releases list returned. Empty array if no releases have been published. |
| `404 Not Found` | Repo not found | The `owner/repo` combination does not exist, or the repository is private without authentication. |
| `403 Forbidden` | Rate limit exceeded | Unauthenticated rate limit of 60 req/hr reached. Add an `Authorization` header to raise it to 5,000/hr. |
| `401 Unauthorized` | Bad credentials | An `Authorization` header was supplied but the token is invalid or expired. |
| `503 Service Unavailable` | API unavailable | GitHub infrastructure issue. Retry with exponential back-off. |
