import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Config } from "./configuration";
import { createS3Client } from "./s3Client";

export async function downloadFromS3(config: S3Config): Promise<string[][]> {
  const client = createS3Client(config);
  const response = await client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: `${config.folderName}/demo.csv`,
    })
  );
  const csvText = await (response.Body as any).transformToString();
  return csvText
    .trim()
    .split("\n")
    .map((line: string) => line.split(",").map((cell: string) => cell.trim()));
}
