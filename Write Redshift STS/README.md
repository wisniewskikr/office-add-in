# Write Redshift Excel Add-in

## Description

This Excel Office Add-in reads cell values from the active worksheet and inserts them as a new row into the `GREETINGS` table in Amazon Redshift via the AWS Redshift Data API.

- **A2** — numeric `id` value
- **B2** — string `message` value

Clicking "Write to Redshift" executes an `INSERT INTO GREETINGS (id, message) VALUES (...)` statement and displays a success or error message in the task pane.

## Installation

### Prerequisites

1. IAM role should be created:
* **Select trusted entity**: AWS Service -> Redshift -> Redshift Customizable
* **Add permissions**: AmazonRedshiftFullAccess
* **Name, review and create**: demo-redshift-role
1. IAM user should be created:
* **Specify user details**: "User name" should be "demo-redshift-user"
* **Set permissions**: Attach policies directly -> AmazonRedshiftFullAccess and AmazonRedshiftDataFullAccess
* **Review and create**: click the button "Create user"
1. Generate access key for IAM user:
* **Choose user**: click the link "demo-redshift-user"
* **Create access key**: Security credentials -> Access keys -> Create access key 
* **Access key best practices & alternatives**: choose "Application running outside AWS"
* **Set description tag**: N/A
* **Retrieve access keys**: click the button "Download .csv file"
1. Create AWS Redshift Cluster
* **Node type**: choose "ra3.large"
* **Nubmer of nodes**: 1
* **Database encryption**: choose "Disable cluster encryption"
* **Cluster permissions**: click the button "Associate IAM roles" and then choose "demo-redshift-role"
* **SQL Queries**: Following SQL query should be run in database:
```
CREATE TABLE "public"."greetings"("id" INTEGER NULL, "message" VARCHAR NULL) ENCODE AUTO;
INSERT INTO "public"."greetings" ("id", "message") values (1, 'Hello World');
```

### Steps

1. Install dependencies:
   ```
   npm install
   ```

2. Fill in your AWS credentials and cluster details in `src/redshift/configuration.ts`:
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

4. Enter a numeric value in cell **A2** (id) and a string value in cell **B2** (message).

5. Click **Write to Redshift** — the row is inserted into the `GREETINGS` table and a success message appears in the task pane.

To verify the write, switch to the Read Redshift add-in and click "Read from Redshift" — the new row should appear in the spreadsheet.
