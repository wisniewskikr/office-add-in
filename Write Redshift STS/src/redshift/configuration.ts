export interface RedshiftConfig {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly roleArn: string;
  readonly roleSessionName: string;
  readonly region: string;
  readonly clusterIdentifier: string;
  readonly dbUser: string;
  readonly database: string;
}

export const redshiftConfig: RedshiftConfig = {
  accessKeyId: "",
  secretAccessKey: "",
  roleArn: "",
  roleSessionName: "RedshiftWriteSession",
  region: "us-east-1",
  clusterIdentifier: "redshift-cluster-1",
  dbUser: "awsuser",
  database: "dev",
};
