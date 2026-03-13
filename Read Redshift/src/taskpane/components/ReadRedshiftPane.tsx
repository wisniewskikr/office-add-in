import React from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
} from "@fluentui/react-components";
import { readFromRedshift } from "../../redshift/redshift";
import { redshiftConfig } from "../../redshift/configuration";

const ReadRedshiftPane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleReadFromRedshift = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await readFromRedshift(redshiftConfig);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleReadFromRedshift} disabled={isLoading}>
        Read from Redshift
      </Button>
      {isLoading && <Spinner size="tiny" style={{ marginTop: 8 }} />}
      {error && (
        <MessageBar intent="error" style={{ marginTop: 8 }}>
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
};

export default ReadRedshiftPane;
