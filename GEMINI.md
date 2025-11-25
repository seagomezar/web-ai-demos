# Gemini Context: web-ai-demos

This repository is a collection of independent demos showcasing client-side (in-browser) AI capabilities, primarily focusing on Chrome's built-in AI features, Transformers.js, and MediaPipe.

## Project Overview

*   **Purpose:** To demonstrate experimental and emerging web AI technologies.
*   **Key Technologies:**
    *   Chrome Built-in AI (Prompt API, Summarization API, etc.)
    *   Google MediaPipe (for running models like Gemma client-side)
    *   Transformers.js
    *   Node.js (for server-side components like SSE)
*   **Structure:** The repository is structured as a collection of standalone projects. There is no root-level dependency management or build system (no npm workspaces).

## Architecture & conventions

*   **Independence:** Each subdirectory represents a distinct demo and should be treated as an isolated project.
*   **Origin Trials:** Many demos rely on Chrome Origin Trials. Look for `<meta http-equiv="origin-trial" ...>` tags in HTML files. These tokens may expire and need replacement for the demos to work.
*   **Static vs. Build:**
    *   Some demos are simple static HTML/JS/CSS files.
    *   Others are React apps or Node.js servers requiring `npm install`.

## Building and Running

Since there is no root build script, you must run each demo individually.

### Prerequisites
*   **Browser:** Chrome Canary or Dev channel is often required for the latest built-in AI features.
*   **Runtime:** Node.js (for demos with `package.json`).

### General Instructions

1.  **Navigate** to the specific demo directory.
2.  **Check** for a `package.json` file.
    *   **If present:** Run `npm install` then `npm start`.
    *   **If absent:** Serve the directory using a static file server (e.g., `npx http-server .` or `python3 -m http.server`).

### Specific Demo Instructions

#### `weather-ai` (React App)
*   **Type:** React application (TypeScript).
*   **Setup:**
    ```bash
    cd weather-ai
    npm install
    npm start
    ```

#### `prompt-api-playground` (Static Site with Tooling)
*   **Type:** Static site with a simplified dev server.
*   **Setup:**
    ```bash
    cd prompt-api-playground
    npm install
    npm start
    ```

#### `gemini-node-sse` (Node.js Backend)
*   **Type:** Node.js Express server.
*   **Setup:**
    ```bash
    cd gemini-node-sse
    npm install
    npm start
    ```
    *   *Note:* Requires API keys configured (check `.env.template`).

#### Static Demos (e.g., `ai-session-management`)
*   **Type:** Vanilla HTML/JS.
*   **Setup:**
    ```bash
    cd ai-session-management
    npx http-server .
    ```

## Development Guidelines

*   **Formatting:** Some projects use Prettier (e.g., `prompt-api-playground`). Check `package.json` for `fix` or `lint` scripts.
*   **License:** Apache-2.0.
*   **Contribution:** All changes require a signed Contributor License Agreement (CLA).
