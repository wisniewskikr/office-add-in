import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { RedshiftConfig } from "./configuration";

export interface TemporaryCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export async function assumeRedshiftRole(config: RedshiftConfig): Promise<TemporaryCredentials> {
  const stsClient = new STSClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const response = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: config.roleArn,
      RoleSessionName: config.roleSessionName,
    })
  );

  const credentials = response.Credentials;
  if (!credentials?.AccessKeyId || !credentials?.SecretAccessKey || !credentials?.SessionToken) {
    throw new Error("STS AssumeRole did not return valid credentials");
  }

  return {
    accessKeyId: credentials.AccessKeyId,
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken,
  };
}
