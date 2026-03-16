import React from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
} from "@fluentui/react-components";
import { uploadToS3 } from "../../s3/s3";
import { s3Config } from "../../s3/configuration";

const WriteS3Pane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleWriteToS3 = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await uploadToS3(s3Config);
      setSuccess("File demo.csv written to S3 successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleWriteToS3} disabled={isLoading}>
        Write to S3
      </Button>
      {isLoading && <Spinner size="tiny" style={{ marginTop: 8 }} />}
      {error && (
        <MessageBar intent="error" style={{ marginTop: 8 }}>
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}
      {success && (
        <MessageBar intent="success" style={{ marginTop: 8 }}>
          <MessageBarBody>{success}</MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
};

export default WriteS3Pane;
