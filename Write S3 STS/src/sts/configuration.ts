export interface STSConfig {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly bucketName: string;
  readonly folderName: string;
  readonly fileName: string;
  readonly roleArn: string;
}

export const stsConfig: STSConfig = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "eu-west-1",
  bucketName: "",
  folderName: "uploads",
  fileName: "demo.csv",
  roleArn: "",
};
