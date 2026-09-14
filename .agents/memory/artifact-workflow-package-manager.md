---
name: Artifact workflow package manager
description: An environment-specific pnpm behavior that can prevent managed artifact workflows from starting.
---

Managed artifact workflows can fail before starting the app when the repository requests a pnpm version different from the installed Nix pnpm. In this environment, disabling automatic package-manager version switching in `.npmrc` lets the workflow use the installed pnpm and respect the injected artifact port.

**Why:** The workflow repeatedly tried to download and self-install the requested pnpm version, then exited before Vite could open its managed port.

**How to apply:** If an artifact workflow fails with repeated `pnpm add pnpm@...` and resource or certificate errors, check the installed pnpm version and the repository `packageManager` field before changing application code.