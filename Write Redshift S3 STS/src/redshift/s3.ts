import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { RedshiftConfig, S3Config } from "./configuration";
import { assumeRedshiftRole } from "./stsClient";

export async function uploadCsvToS3(
  csvContent: string,
  redshiftCfg: RedshiftConfig,
  s3Cfg: S3Config
): Promise<string> {
  const credentials = await assumeRedshiftRole(redshiftCfg);

  const s3Client = new S3Client({
    region: redshiftCfg.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });

  const key = s3Cfg.folder ? `${s3Cfg.folder}/${s3Cfg.filename}` : s3Cfg.filename;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Cfg.bucket,
      Key: key,
      Body: csvContent,
      ContentType: "text/csv",
    })
  );

  return `s3://${s3Cfg.bucket}/${key}`;
}
