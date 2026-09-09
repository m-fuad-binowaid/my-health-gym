---
name: GitHub push authentication
description: Environment-specific limitation affecting shell pushes to GitHub.
---

The connected GitHub API integration can inspect the repository, but it does not automatically provide a valid credential to `git push` from the shell. Its GraphQL client may also lack write-mutation permission even when repository metadata reports push/admin access. A GitHub App connection may still leave the shell remote unauthenticated.

**Why:** The repository can be readable and have push permissions while HTTPS Git pushes fail with `Invalid username or token`.

**How to apply:** Treat a failed shell push as an authentication-boundary issue, not a merge conflict. Do not ask for a token in chat; use the supported GitHub connection flow or have the user complete the push from an authenticated Git client.