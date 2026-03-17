/* global fetch */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { STSConfig } from "./configuration";
import { createS3ClientViaSTS } from "./s3Client";

export async function uploadToS3ViaSTS(config: STSConfig): Promise<void> {
  const response = await fetch(`/assets/${config.fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${config.fileName}: ${response.statusText}`);
  }
  const csvContent = await response.text();
  const client = await createS3ClientViaSTS(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${config.folderName}/${config.fileName}`,
      Body: csvContent,
      ContentType: "text/csv",
    })
  );
}
