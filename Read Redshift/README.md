# Read Redshift Excel Add-in

## Description

An Excel Office Add-in that adds a **Read Redshift** button under the **Demo** ribbon tab. Clicking the button opens a task pane with a **Read from Redshift** button that queries Amazon Redshift via the Data API and writes the results into the active worksheet.

**Tech stack:** React, TypeScript, Fluent UI v9, Webpack, Office.js, `@aws-sdk/client-redshift-data`

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

### Configure credentials

Before running the add-in, fill in your AWS credentials and cluster details in `src/redshift/configuration.ts`:

```typescript
export const redshiftConfig: RedshiftConfig = {
  accessKeyId: "<your-access-key-id>",
  secretAccessKey: "<your-secret-access-key>",
  region: "eu-west-1",
  clusterIdentifier: "redshift-cluster-1",
  dbUser: "awsuser",
  database: "dev",
};
```

### Use the add-in in Excel

1. Open Excel (it launches automatically with `npm start`).
2. Click the **Demo** tab in the ribbon.
3. Click **Read Redshift** to open the task pane.
4. Click the **Read from Redshift** button.
   - A spinner is shown while the query runs.
   - Results are written to the active worksheet starting at row 2, column A.
   - An error message is displayed if the query fails (e.g. invalid credentials).

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
