import React from "react";
import {
  Button,
  Input,
  Label,
  MessageBar,
  MessageBarBody,
  Spinner,
} from "@fluentui/react-components";
import { writeToRedshift } from "../../redshift/redshift";
import { redshiftConfig, defaultS3Config } from "../../redshift/configuration";

const WriteRedshiftPane: React.FC = () => {
  const [bucket, setBucket] = React.useState(defaultS3Config.bucket);
  const [folder, setFolder] = React.useState(defaultS3Config.folder);
  const [filename, setFilename] = React.useState(defaultS3Config.filename);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleWriteToRedshift = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await writeToRedshift(redshiftConfig, { bucket, folder, filename });
      setSuccess("Data loaded into GREETINGS successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Label htmlFor="bucket">S3 Bucket</Label>
        <Input
          id="bucket"
          placeholder="my-bucket"
          value={bucket}
          onChange={(_, data) => setBucket(data.value)}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Label htmlFor="folder">Folder (optional)</Label>
        <Input
          id="folder"
          placeholder="path/to/folder"
          value={folder}
          onChange={(_, data) => setFolder(data.value)}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Label htmlFor="filename">Filename</Label>
        <Input
          id="filename"
          placeholder="data.csv"
          value={filename}
          onChange={(_, data) => setFilename(data.value)}
        />
      </div>
      <Button appearance="primary" onClick={handleWriteToRedshift} disabled={isLoading || !bucket || !filename}>
        Write Redshift S3 Copy STS
      </Button>
      {isLoading && <Spinner size="tiny" />}
      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}
      {success && (
        <MessageBar intent="success">
          <MessageBarBody>{success}</MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
};

export default WriteRedshiftPane;
