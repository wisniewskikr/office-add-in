/* global Excel */

import React from "react";
import { Button, MessageBar, MessageBarBody, Spinner, Text } from "@fluentui/react-components";
import { uploadCsvToS3 } from "../../redshift/s3";
import { copyFromS3ToRedshift } from "../../redshift/redshift";
import { redshiftConfig, s3Config } from "../../redshift/configuration";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function readExcelData(): Promise<string> {
  return Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load("values");
    await context.sync();

    const values: unknown[][] = usedRange.values;
    if (!values || values.length < 2) {
      throw new Error(
        "No data found. Please fill in at least one row below the header (Id, Message)."
      );
    }

    const dataRows = values.slice(1);
    const csvLines = dataRows
      .filter((row) => row[0] !== null && row[0] !== undefined && row[0] !== "")
      .map((row) => {
        const id = escapeCsvField(String(row[0] ?? ""));
        const message = escapeCsvField(String(row[1] ?? ""));
        return `${id},${message}`;
      });

    if (csvLines.length === 0) {
      throw new Error("No data rows found. Please fill in the Id and Message columns.");
    }

    return ["id,message", ...csvLines].join("\n");
  });
}

const WriteRedshiftPane: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleWriteToRedshift = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setStatus(null);

    try {
      setStatus("Reading data from Excel...");
      const csvContent = await readExcelData();

      setStatus("Exporting data to AWS S3...");
      const s3Path = await uploadCsvToS3(csvContent, redshiftConfig, s3Config);

      setStatus("Copying data from AWS S3 to AWS Redshift...");
      await copyFromS3ToRedshift(redshiftConfig, s3Path);

      setStatus(null);
      setSuccess(`Data successfully written to Redshift table '${redshiftConfig.tableName}'.`);
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
      <Text size={500} weight="semibold">
        Write Redshift S3 STS
      </Text>
      <Text size={300}>
        Reads data from the active Excel sheet (columns Id and Message) and writes it to AWS
        Redshift via S3.
      </Text>
      <Button
        appearance="primary"
        onClick={handleWriteToRedshift}
        disabled={isLoading}
        style={{ alignSelf: "flex-start" }}
      >
        Write to Redshift via S3
      </Button>
      {isLoading && status && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Spinner size="tiny" />
          <Text size={300}>{status}</Text>
        </div>
      )}
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
