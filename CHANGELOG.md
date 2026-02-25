# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New Full-screen Login Page with modern UI and breathing background.
- Notice overlay for legacy magic link attempts.
- Brute-force protection: max 10 login attempts per IP per 60s.
- Mandatory confirmation for high-risk endpoints (`/api/kill`).
- Rate limiting for destructive endpoints.
- Jest + Supertest test suite with unit and API integration tests. (#7)
- ESLint + Prettier code style enforcement. (#7)
- GitHub Actions CI workflow running tests and lint on every push. (#7)
- Split `public/index.html` into separate `public/css/dashboard.css` and `public/js/dashboard.js` for maintainability.

### Fixed
- Security: Replaced URL query auth with HttpOnly cookie-based sessions. (Thanks [@yaochao](https://github.com/yaochao) for reporting #1)
- Security: Added safeguards for remote endpoints. (Thanks [@yaochao](https://github.com/yaochao) for reporting #2)
- Bug: Improved error handling and removed silent catch blocks. (Thanks [@yaochao](https://github.com/yaochao) for reporting #4)
- Bug: Removed hardcoded paths for better environment portability. (Thanks [@yaochao](https://github.com/yaochao) for reporting #5)
- Bug: Improved stability in context reading when session files are missing.

### Changed
- Refactored installer (`setup.sh`) to remove magic link output in favor of secure login.
- Replaced `wget` with Node.js native `https` module for binary downloads. (Thanks [@yaochao](https://github.com/yaochao) for reporting #6)
- Cleaned up unused dependencies to reduce footprint.
