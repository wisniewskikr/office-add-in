/* global fetch */
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { STSConfig } from "./configuration";
import { createS3ClientViaSTS } from "./s3Client";

async function ensureBucketExists(client: S3Client, config: STSConfig): Promise<void> {
  try {
    await client.send(new HeadBucketCommand({ Bucket: config.bucketName }));
  } catch (e) {
    const status = e instanceof S3ServiceException ? e.$metadata.httpStatusCode : undefined;
    if (status === 404 || status === 403) {
      const createParams =
        config.region === "us-east-1"
          ? { Bucket: config.bucketName }
          : {
              Bucket: config.bucketName,
              CreateBucketConfiguration: { LocationConstraint: config.region as any },
            };
      await client.send(new CreateBucketCommand(createParams));
    } else {
      throw e;
    }
  }
}

async function ensureFolderExists(client: S3Client, config: STSConfig): Promise<void> {
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${config.folderName}/`,
      Body: "",
    })
  );
}

export async function uploadToS3ViaSTS(config: STSConfig): Promise<void> {
  const response = await fetch(`/assets/${config.fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${config.fileName}: ${response.statusText}`);
  }
  const csvContent = await response.text();
  const client = await createS3ClientViaSTS(config);
  await ensureBucketExists(client, config);
  await ensureFolderExists(client, config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${config.folderName}/${config.fileName}`,
      Body: csvContent,
      ContentType: "text/csv",
    })
  );
}
