import React from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
} from "@fluentui/react-components";
import { writeToRedshift } from "../../redshift/redshift";
import { redshiftConfig } from "../../redshift/configuration";

const WriteRedshiftPane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleWriteToRedshift = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await writeToRedshift(redshiftConfig);
      setSuccess("Row written to GREETINGS successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleWriteToRedshift} disabled={isLoading}>
        Write to Redshift
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

export default WriteRedshiftPane;
