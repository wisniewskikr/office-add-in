# Write S3

An Excel Office Add-in that uploads a CSV file to Amazon S3 with a single button click.

## Description

Write S3 adds a **Demo** tab to the Excel ribbon with a **Write S3** button. Clicking the button opens a task pane containing a **Write to S3** button. When clicked, the add-in fetches `demo.csv` from the assets folder and uploads it to a configurable S3 bucket and folder.

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
   };
   ```

3. Start the add-in (this will open Excel with the add-in sideloaded):
   ```bash
   npm start
   ```

## Usage

1. In Excel, click the **Demo** tab in the ribbon.
2. Click the **Write S3** button to open the task pane.
3. Click **Write to S3** in the task pane.
4. The file `demo.csv` will be uploaded to `{folderName}/demo.csv` in your configured S3 bucket.
5. A success or error message will appear in the task pane.
