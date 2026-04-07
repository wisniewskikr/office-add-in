import { S3Client } from "@aws-sdk/client-s3";
import { AssumeRoleCommand } from "@aws-sdk/client-sts";
import { STSConfig } from "./configuration";
import { createSTSClient } from "./stsClient";

export async function createS3ClientViaSTS(config: STSConfig): Promise<S3Client> {
  const stsClient = createSTSClient(config);
  const response = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: config.roleArn,
      RoleSessionName: "WriteS3STSSession",
    })
  );

  const credentials = response.Credentials;
  if (!credentials?.AccessKeyId || !credentials?.SecretAccessKey || !credentials?.SessionToken) {
    throw new Error("Failed to obtain temporary credentials from STS.");
  }

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  });
}
