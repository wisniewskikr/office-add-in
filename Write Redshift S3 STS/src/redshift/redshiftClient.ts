import { RedshiftDataClient } from "@aws-sdk/client-redshift-data";
import { RedshiftConfig } from "./configuration";
import { assumeRedshiftRole } from "./stsClient";

export async function createRedshiftClient(config: RedshiftConfig): Promise<RedshiftDataClient> {
  const credentials = await assumeRedshiftRole(config);
  return new RedshiftDataClient({
    region: config.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });
}
