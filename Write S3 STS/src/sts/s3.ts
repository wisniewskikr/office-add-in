/* global Excel */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { STSConfig } from "./configuration";
import { createS3ClientViaSTS } from "./s3Client";

async function readExcelDataAsCSV(): Promise<string> {
  return Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load("values");
    await context.sync();

    const values: unknown[][] = usedRange.values;
    if (!values || values.length === 0) {
      throw new Error("No data found in the worksheet");
    }

    return values
      .map((row) => {
        const col1 = row[0] !== undefined && row[0] !== null ? String(row[0]) : "";
        const col2 = row[1] !== undefined && row[1] !== null ? String(row[1]) : "";
        return `${col1},${col2}`;
      })
      .join("\n");
  });
}

export async function uploadToS3ViaSTS(config: STSConfig): Promise<void> {
  const csvContent = await readExcelDataAsCSV();
  const client = await createS3ClientViaSTS(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${config.folderName}/${config.fileName}`,
      Body: csvContent,
      ContentType: "text/csv",
    })
  );
}
