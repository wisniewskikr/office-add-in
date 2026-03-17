import React from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
} from "@fluentui/react-components";
import { uploadToS3ViaSTS } from "../../sts/s3";
import { stsConfig } from "../../sts/configuration";

const WriteS3STSPane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleWriteToS3ViaSTS = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await uploadToS3ViaSTS(stsConfig);
      setSuccess(`File ${stsConfig.fileName} written to S3 successfully.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleWriteToS3ViaSTS} disabled={isLoading}>
        Write to S3 via STS
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

export default WriteS3STSPane;
