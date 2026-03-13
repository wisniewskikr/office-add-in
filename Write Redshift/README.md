# Write Redshift Excel Add-in

## Description

This Excel Office Add-in reads cell values from the active worksheet and inserts them as a new row into the `GREETINGS` table in Amazon Redshift via the AWS Redshift Data API.

- **A2** — numeric `id` value
- **B2** — string `name` value

Clicking "Write to Redshift" executes an `INSERT INTO GREETINGS (id, name) VALUES (...)` statement and displays a success or error message in the task pane.

## Installation

### Prerequisites

- Node.js v16 or later
- An Amazon Redshift cluster with a `GREETINGS` table containing `id` (integer) and `name` (varchar) columns
- AWS credentials with permission to call the Redshift Data API

### Steps

1. Install dependencies:
   ```
   npm install
   ```

2. Install the development HTTPS certificate (required by Office Add-ins):
   ```
   npx office-addin-dev-certs install
   ```

3. Fill in your AWS credentials and cluster details in `src/redshift/configuration.ts`:
   ```typescript
   export const redshiftConfig: RedshiftConfig = {
     accessKeyId: "<your-access-key-id>",
     secretAccessKey: "<your-secret-access-key>",
     region: "<your-region>",
     clusterIdentifier: "<your-cluster-identifier>",
     dbUser: "<your-db-user>",
     database: "<your-database>",
   };
   ```

## Usage

1. Start the add-in (launches Excel with the add-in sideloaded):
   ```
   npm start
   ```

2. In Excel, click the **Demo** tab in the ribbon.

3. Click the **Write Redshift** button — the "Write Redshift" task pane opens.

4. Enter a numeric value in cell **A2** (id) and a string value in cell **B2** (name).

5. Click **Write to Redshift** — the row is inserted into the `GREETINGS` table and a success message appears in the task pane.

To verify the write, switch to the Read Redshift add-in and click "Read from Redshift" — the new row should appear in the spreadsheet.
