# mozaik-cli

Terminal chat for the **Mozaik** agent: an [Ink](https://github.com/vadimdemedes/ink) UI, tool calling, and streaming replies via `@mozaik-ai/core`.

## Usage

```bash
npm run build
node dist/cli.js
```

Or link it globally after build:

```bash
npm link
mozaik-cli
```
![Mozaik CLI](public/mozaik-cli.png)

Load secrets from a `.env` in the current directory (or parent paths). See the Mozaik / OpenAI setup you use for this project.
