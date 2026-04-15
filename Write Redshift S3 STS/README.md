# Write Redshift S3 STS Excel Add-in

## Description

This Excel Office Add-in reads data from the active worksheet and loads it into an Amazon Redshift table. The flow is:

1. User fills in the Excel sheet — first row must be the header (`Id`, `Message`), subsequent rows contain data values.
2. The add-in reads those rows and generates a CSV file in memory.
3. The CSV is uploaded to Amazon S3 using temporary AWS credentials obtained via STS.
4. Redshift executes a `COPY` command to load the data from S3.

Authentication for both S3 and Redshift is handled via AWS STS — a short-lived role session is assumed before each operation.

The target Redshift table must have two columns in this order:

| Column  | Type    | Redshift column |
|---------|---------|-----------------|
| id      | INTEGER | id              |
| message | VARCHAR | message         |

The first row of the CSV is treated as a header and is skipped automatically (`IGNOREHEADER 1`).

Clicking **Write to Redshift via S3** executes the following sequence:

```sql
-- Redshift COPY executed internally by the add-in:
COPY <tableName> (id, message)
FROM 's3://<bucket>/<folder>/<filename>'
IAM_ROLE '<roleArn>'
FORMAT AS CSV
IGNOREHEADER 1
```

## Installation

### Prerequisites

**AWS IAM — Create role `demo-role-redshift-sts`:**
1. Go to **IAM → Roles → Create role**.
2. Select trusted entity type: **AWS account** → **This account**.
3. Attach permission policy: `AmazonRedshiftDataFullAccess`.
4. Name the role `demo-role-redshift-sts` and create it.
5. Open the newly created role, go to **Permissions → Add permissions → Create inline policy**.
6. Switch to **JSON** editor and enter the following policy to allow Redshift to obtain cluster credentials:
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
8. Add a second inline policy to allow the role to read from and write to S3. The add-in uploads the CSV (`s3:PutObject`) and Redshift reads it during `COPY` (`s3:GetObject`, `s3:ListBucket`). Switch to **JSON** editor and enter:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::<bucket-name>",
           "arn:aws:s3:::<bucket-name>/*"
         ]
       }
     ]
   }
   ```
   Replace `<bucket-name>` with your S3 bucket name. Name the policy `S3AccessForRedshiftCopy` and save.

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
1. Go to **IAM → Roles → demo-role-redshift-sts → Trust relationships → Edit trust policy**.
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

> **Note:** The `redshift.amazonaws.com` principal in the trust policy is required so that Redshift can use this role to access S3 during the `COPY` command execution.

**AWS S3 — Create bucket:**
1. Create or choose an existing S3 bucket in the same region as your Redshift cluster.
2. Note the bucket name and the folder path (if any) where the add-in will upload the CSV — you will enter these in `configuration.ts`.
3. No manual CSV upload is needed — the add-in generates and uploads the file automatically from the Excel data.

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

2. Fill in your AWS credentials, cluster details, and S3 location in `src/redshift/configuration.ts`:
   ```typescript
   export const redshiftConfig: RedshiftConfig = {
     accessKeyId: "<your-access-key-id>",
     secretAccessKey: "<your-secret-access-key>",
     roleArn: "arn:aws:iam::<account-id>:role/demo-role-redshift-sts",
     roleSessionName: "RedshiftWriteSession",
     region: "<your-region>",
     clusterIdentifier: "<your-cluster-identifier>",
     dbUser: "<your-db-user>",
     database: "<your-database>",
     tableName: "GREETINGS",
   };

   export const s3Config: S3Config = {
     bucket: "<your-bucket-name>",
     folder: "<optional-folder-path>",  // leave empty string "" if file goes to bucket root
     filename: "data.csv",
   };
   ```

## Usage

1. Start the add-in (launches Excel with the add-in sideloaded):
   ```
   npm start
   ```

2. In Excel, fill in the active worksheet:
   - Cell **A1**: `Id`, cell **B1**: `Message` (header row)
   - Rows 2 onwards: data values in columns A and B

   Example:

   | Id | Message     |
   |----|-------------|
   | 1  | Hello World |
   | 2  | Foo Bar     |

3. Click the **Demo** tab in the ribbon.

4. Click the **Write Redshift S3 STS** button — the task pane opens.

5. Click **Write to Redshift via S3**. The task pane shows the current status:
   - *Reading data from Excel...*
   - *Exporting data to AWS S3...*
   - *Copying data from AWS S3 to AWS Redshift...*

6. A success or error message appears when the operation completes.

To verify the load, open Query Editor v2, connect to the cluster, and run:
```sql
SELECT * FROM greetings;
```
