# Write S3 STS

## Description

An Office Excel Add-in that uploads `demo.csv` to Amazon S3 using short-lived credentials obtained via AWS Security Token Service (STS). Instead of using long-lived IAM credentials directly with S3, the add-in first calls `AssumeRole` on STS to obtain temporary `AccessKeyId`, `SecretAccessKey`, and `SessionToken`, then uses those scoped credentials to perform the upload. This reduces the blast radius of any credential exposure.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev-server
   ```

3. Sideload the add-in in Excel by opening **Insert → Add-ins → Upload My Add-in** and selecting `manifest.xml`.

4. Fill in your credentials and configuration in `src/sts/configuration.ts`:
   - `accessKeyId` / `secretAccessKey` — base IAM credentials with permission to call `sts:AssumeRole`
   - `region` — AWS region (default: `eu-west-1`)
   - `bucketName` — target S3 bucket
   - `folderName` — folder prefix inside the bucket (default: `uploads`)
   - `roleArn` — ARN of the IAM role to assume (e.g. `arn:aws:iam::123456789012:role/MyRole`)

## Usage

1. In Excel, click the **Demo** ribbon tab.
2. Click the **Write S3 STS** button to open the task pane.
3. Click **Write to S3 via STS** in the task pane.
4. The add-in assumes the configured role via STS, then uploads `demo.csv` to `{bucketName}/{folderName}/demo.csv`.
5. A success message appears in the task pane when the upload completes.
