import React from "react";
import { Button, MessageBar, MessageBarBody, Spinner } from "@fluentui/react-components";
import { downloadFromS3 } from "../../s3/s3";
import { s3Config } from "../../s3/configuration";

/* global Excel */

const ReadS3Pane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleReadFromS3 = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const rows = await downloadFromS3(s3Config);
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange("A1:B2");
        range.values = rows;
        await context.sync();
      });
      setSuccess(`${s3Config.fileName} read from S3 and written to Excel.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleReadFromS3} disabled={isLoading}>
        Read from S3
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

export default ReadS3Pane;
