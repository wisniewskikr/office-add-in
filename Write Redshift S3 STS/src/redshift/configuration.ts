export interface RedshiftConfig {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly roleArn: string;
  readonly roleSessionName: string;
  readonly region: string;
  readonly clusterIdentifier: string;
  readonly dbUser: string;
  readonly database: string;
  readonly tableName: string;
}

export interface S3Config {
  readonly bucket: string;
  readonly folder: string;
  readonly filename: string;
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
  tableName: "GREETINGS",
};

export const s3Config: S3Config = {
  bucket: "",
  folder: "",
  filename: "data.csv",
};
