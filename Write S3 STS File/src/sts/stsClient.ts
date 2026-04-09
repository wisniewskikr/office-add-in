import { STSClient } from "@aws-sdk/client-sts";
import { STSConfig } from "./configuration";

export function createSTSClient(config: STSConfig): STSClient {
  return new STSClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}
