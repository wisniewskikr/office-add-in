# Write S3 STS

An Excel Office Add-in that uploads a CSV file to Amazon S3 using short-lived credentials obtained via AWS Security Token Service (STS).

## Description

Write S3 STS adds a **Demo** tab to the Excel ribbon with a **Write S3 STS** button. Clicking the button opens a task pane containing a **Write to S3 via STS** button. When clicked, the add-in first calls `AssumeRole` on AWS STS using base IAM credentials to obtain temporary `AccessKeyId`, `SecretAccessKey`, and `SessionToken`. It then uses those scoped, short-lived credentials to fetch a configurable CSV file from the assets folder and upload it to a configurable S3 bucket and folder.

Using STS instead of long-lived credentials reduces the blast radius of any credential exposure — the temporary credentials expire automatically and are scoped only to the permissions of the assumed role.

## AWS Prerequisites

Before running the add-in, complete the following steps in AWS:

### 1. Create an IAM user (base credentials)

Create an IAM user whose `accessKeyId` and `secretAccessKey` you will put in `configuration.ts`. This user's only required permission is to call `sts:AssumeRole` on the role you create in step 2.

Attach the following inline or managed policy to the user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME"
    }
  ]
}
```

### 2. Create an IAM role (assumed via STS)

Create an IAM role whose ARN you will put in `configuration.ts` as `roleArn`. This role performs the actual S3 operations.

**Trust policy** — allows the IAM user from step 1 to assume the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER_NAME"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Permissions policy** — grants the role access to S3:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:HeadBucket",
        "s3:CreateBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

> If the bucket already exists and you do not need to create it, `s3:CreateBucket` can be omitted.

### 3. Create the S3 bucket and folder

The bucket and folder are **not** created automatically — you must create them manually in the AWS Console (or CLI) using the exact names you will set in `configuration.ts`:

- Create a bucket with the name you will use as `bucketName`.
- Inside that bucket, create a folder with the name you will use as `folderName`.

### 4. Configure CORS on the bucket

The add-in runs in a browser context and makes requests directly to S3, so the bucket requires a CORS policy. In the AWS Console go to your bucket → **Permissions** → **Cross-origin resource sharing (CORS)** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["https://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

> **Important:** S3 does **not** include CORS headers in `403` error responses. If the assumed role lacks S3 permissions, the browser will receive a `403` with no CORS headers and throw `Failed to fetch` — even though the CORS rule itself is correct. Always verify IAM permissions first before debugging CORS.

> For production use, replace `https://localhost:3000` in `AllowedOrigins` with the specific origin of your deployed add-in.

---

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your AWS credentials and S3 bucket in `src/sts/configuration.ts`:
   ```typescript
   export const stsConfig: STSConfig = {
     accessKeyId: "YOUR_ACCESS_KEY_ID",       // IAM user with sts:AssumeRole permission
     secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
     region: "eu-west-1",
     bucketName: "YOUR_BUCKET_NAME",
     folderName: "uploads",
     fileName: "demo.csv",
     roleArn: "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME",
   };
   ```

   | Field             | Description                                                          |
   |-------------------|----------------------------------------------------------------------|
   | `accessKeyId`     | Access key of the IAM user that calls `sts:AssumeRole`              |
   | `secretAccessKey` | Secret key of the same IAM user                                     |
   | `region`          | AWS region for both STS and S3 (e.g. `eu-west-1`)                  |
   | `bucketName`      | Name of the target S3 bucket                                        |
   | `folderName`      | Folder prefix inside the bucket (e.g. `uploads`)                    |
   | `fileName`        | Name of the file to upload (must exist in `assets/`)                |
   | `roleArn`         | ARN of the IAM role to assume (grants the actual S3 permissions)    |

3. Start the add-in (this will open Excel with the add-in sideloaded):
   ```bash
   npm start
   ```

## Usage

1. In Excel, click the **Demo** tab in the ribbon.
2. Click the **Write S3 STS** button to open the task pane.
3. Click **Write to S3 via STS** in the task pane.
4. The add-in assumes the role via STS, then uploads `{fileName}` to `{folderName}/{fileName}` in your configured S3 bucket.
5. A success or error message will appear in the task pane.
