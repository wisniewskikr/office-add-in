import { RedshiftDataClient } from "@aws-sdk/client-redshift-data";
import { RedshiftConfig } from "./configuration";

export function createRedshiftClient(config: RedshiftConfig): RedshiftDataClient {
  return new RedshiftDataClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}
