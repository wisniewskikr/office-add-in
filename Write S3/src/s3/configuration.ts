export interface S3Config {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly bucketName: string;
  readonly folderName: string;
}

export const s3Config: S3Config = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "eu-west-1",
  bucketName: "",
  folderName: "uploads",
};
