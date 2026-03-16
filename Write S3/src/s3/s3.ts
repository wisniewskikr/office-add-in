/* global fetch */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Config } from "./configuration";
import { createS3Client } from "./s3Client";

export async function uploadToS3(config: S3Config): Promise<void> {
  const response = await fetch("/assets/demo.csv");
  if (!response.ok) {
    throw new Error(`Failed to fetch demo.csv: ${response.statusText}`);
  }
  const csvContent = await response.text();
  const client = createS3Client(config);
  const key = `${config.folderName}/demo.csv`;
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: csvContent,
      ContentType: "text/csv",
    })
  );
}
