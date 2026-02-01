# Ruzi Valentine

## Prerequisites

- **Node.js**: 18.17+ (or 20 LTS recommended)
- **npm**: comes with Node.js

> This project uses Next.js 14 and requires Node 18.17+; older versions (like Node 14) will fail to install.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Troubleshooting

If `npm install` fails on Windows:

1. Ensure you upgraded Node.js to 18.17+ (or 20 LTS).
2. Delete `node_modules` and any `package-lock.json` and reinstall:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```
