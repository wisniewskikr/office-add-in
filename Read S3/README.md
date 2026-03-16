# Read S3

An Excel Office Add-in that reads a CSV file from Amazon S3 and displays its contents in the active worksheet.

## Description

Read S3 adds a **Demo** tab to the Excel ribbon with a **Read S3** button. Clicking the button opens a task pane containing a **Read from S3** button. When clicked, the add-in downloads `demo.csv` from a configurable S3 bucket and folder and writes its contents into cells A1:B2 of the active worksheet.

Expected `demo.csv` contents:
```
Id, Message
1, Hello World
```

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

3. Start the add-in (opens Excel with the add-in sideloaded):
   ```bash
   npm start
   ```

## Usage

1. In Excel, click the **Demo** tab in the ribbon.
2. Click **Read S3** to open the task pane.
3. Click **Read from S3** in the task pane.
4. Cells A1:B2 of the active worksheet will be populated with the CSV data.
5. A success or error message will appear in the task pane.

> **Note:** The S3 bucket must have a CORS policy allowing `https://localhost:3000` for local development.
