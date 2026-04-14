# Write Redshift Excel Add-in

## Description

This Excel Office Add-in reads cell values from the active worksheet and inserts them as a new row into the `GREETINGS` table in Amazon Redshift via the AWS Redshift Data API.

- **A2** — numeric `id` value
- **B2** — string `message` value

Clicking "Write to Redshift" executes an `INSERT INTO GREETINGS (id, message) VALUES (...)` statement and displays a success or error message in the task pane.

## Installation

### Prerequisites

**AWS IAM — Create role `demo-role-redshift-sts`:**
1. Go to **IAM → Roles → Create role**.
2. Select trusted entity type: **AWS account** → **This account**.
3. Attach permission policy: `AmazonRedshiftDataFullAccess`.
4. Name the role `demo-role-redshift-sts` and create it.
5. Open the newly created role, go to **Permissions → Add permissions → Create inline policy**.
6. Switch to **JSON** editor and enter:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "redshift:GetClusterCredentials",
         "Resource": [
           "arn:aws:redshift:<region>:<account-id>:dbuser:<cluster-identifier>/<db-user>",
           "arn:aws:redshift:<region>:<account-id>:dbname:<cluster-identifier>/<database>"
         ]
       }
     ]
   }
   ```
7. Name the policy `RedshiftGetClusterCredentials` and save.

**AWS IAM — Create user `demo-user-redshift-sts`:**
1. Go to **IAM → Users → Create user**.
2. Name the user `demo-user-redshift-sts`, click through to create (no permissions needed yet).
3. Open the user, go to **Permissions → Add permissions → Create inline policy**.
4. Switch to **JSON** editor and enter:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "sts:AssumeRole",
         "Resource": "arn:aws:iam::<account-id>:role/demo-role-redshift-sts"
       }
     ]
   }
   ```
5. Name the policy `AssumeRedshiftRole` and save.
6. Go to **Security credentials → Access keys → Create access key**.
7. Choose **Other**, create the key and save `accessKeyId` and `secretAccessKey` — use them in `configuration.ts`.

**AWS IAM — Update trust policy of `demo-role-redshift-sts`:**
1. Go to **IAM → Roles → demo-redshift-role → Trust relationships → Edit trust policy**.
2. Replace the content with:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::<account-id>:user/demo-user-redshift-sts"
         },
         "Action": "sts:AssumeRole"
       },
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "redshift.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

**AWS Redshift — Create cluster:**
1. Go to **Amazon Redshift → Clusters → Create cluster**.
2. Set **Cluster identifier**: `redshift-cluster-1`.
3. Choose **Free trial** node configuration (or select node type manually).
4. Set **Admin user name** (e.g. `awsuser`) and a password.
5. Under **Additional configurations → Network and security**, make sure the cluster is **publicly accessible** if connecting from a local machine.
6. Click **Create cluster** and wait until the status is **Available**.
7. Attach `demo-role-redshift-sts` to the cluster:
   - Go to **Amazon Redshift → Clusters → redshift-cluster-1 → Properties → Associated IAM roles** → **Associate IAM roles** → select `demo-role-redshift-sts` → confirm.

**AWS Redshift — Create table:**
1. Go to the cluster → **Query data** (opens Query Editor v2).
2. Connect using admin credentials and run:
   ```sql
   CREATE TABLE "public"."greetings" ("id" INTEGER NULL, "message" VARCHAR NULL);
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
     roleArn: "arn:aws:iam::<account-id>:role/demo-redshift-role",
     roleSessionName: "RedshiftWriteSession",
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
