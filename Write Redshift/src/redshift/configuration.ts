export interface RedshiftConfig {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly clusterIdentifier: string;
  readonly dbUser: string;
  readonly database: string;
}

export const redshiftConfig: RedshiftConfig = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "eu-west-1",
  clusterIdentifier: "redshift-cluster-1",
  dbUser: "awsuser",
  database: "dev",
};
