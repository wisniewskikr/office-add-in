# Read Redshift Excel Add-in

## Description

An Excel Office Add-in that adds a **Read Redshift** button under the **Demo** ribbon tab. Clicking the button opens a task pane with a "Read from Redshift" button (placeholder — no action implemented yet).

**Tech stack:** React, TypeScript, Fluent UI v9, Webpack, Office.js

---

## Installation

**Prerequisites:** Node.js (v16 or later)

```bash
cd "Read Redshift"
npm install
```

Trust the development certificates (first time only):

```bash
npx office-addin-dev-certs install
```

---

## Usage

### Start debugging

```bash
npm start
```

This launches the webpack dev server on `https://localhost:3000` and opens Excel with the add-in sideloaded.

### Stop debugging

```bash
npm stop
```

### Use the add-in in Excel

1. Open Excel (it launches automatically with `npm start`).
2. Click the **Demo** tab in the ribbon.
3. Click **Read Redshift** to open the task pane.
4. The task pane shows a **Read from Redshift** button (placeholder).

### Available scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start debugging in Excel desktop |
| `npm stop` | Stop debugging |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run dev-server` | Start webpack dev server only |
| `npm run validate` | Validate the manifest |
| `npm run lint` | Check for lint errors |
