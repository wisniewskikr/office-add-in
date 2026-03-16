# Write S3

An Excel Office Add-in that uploads a CSV file to Amazon S3 with a single button click.

## Description

Write S3 adds a **Demo** tab to the Excel ribbon with a **Write S3** button. Clicking the button opens a task pane containing a **Write to S3** button. When clicked, the add-in fetches a configurable CSV file from the assets folder and uploads it to a configurable S3 bucket and folder.

## AWS Prerequisites

Before running the add-in, complete the following steps in AWS:

### 1. IAM permissions

The IAM user whose credentials you provide must have the **AmazonS3FullAccess** policy attached.

### 2. Create the S3 bucket and folder

The bucket and folder are **not** created automatically — you must create them manually in the AWS Console (or CLI) using the exact names you will set in `configuration.ts`:

- Create a bucket with the name you will use as `bucketName`.
- Inside that bucket, create a folder with the name you will use as `folderName`.

### 3. Configure CORS on the bucket

The add-in runs in a browser context and makes requests directly to S3, so the bucket requires a CORS policy. In the AWS Console go to your bucket → **Permissions** → **Cross-origin resource sharing (CORS)** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

> For production use, replace `"*"` in `AllowedOrigins` with the specific origin of your add-in.

---

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your AWS credentials and S3 bucket in `src/s3/configuration.ts`:
   ```typescript
   export const s3Config: S3Config = {
     accessKeyId: "YOUR_ACCESS_KEY_ID",
     secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
     region: "eu-west-1",
     bucketName: "YOUR_BUCKET_NAME",
     folderName: "uploads",
     fileName: "demo.csv",
   };
   ```

   The `bucketName` and `folderName` values must match exactly what you created in AWS.

3. Start the add-in (this will open Excel with the add-in sideloaded):
   ```bash
   npm start
   ```

## Usage

1. In Excel, click the **Demo** tab in the ribbon.
2. Click the **Write S3** button to open the task pane.
3. Click **Write to S3** in the task pane.
4. The file configured as `fileName` will be uploaded to `{folderName}/{fileName}` in your configured S3 bucket.
5. A success or error message will appear in the task pane.
