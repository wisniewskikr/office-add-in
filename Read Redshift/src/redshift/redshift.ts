/* global Excel console */

import {
  RedshiftDataClient,
  ExecuteStatementCommand,
  DescribeStatementCommand,
  GetStatementResultCommand,
  Field,
} from "@aws-sdk/client-redshift-data";
import { RedshiftConfig } from "./configuration";
import { createRedshiftClient } from "./redshiftClient";

const SQL = "select * from GREETINGS";
const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ATTEMPTS = 60;

export async function readFromRedshift(config: RedshiftConfig): Promise<void> {
  const client = createRedshiftClient(config);
  const statementId = await runExecuteStatement(client, config, SQL);
  const subStatementId = await pollUntilFinished(client, statementId);
  const recordArray = await getRecordArray(client, subStatementId);
  await fillExcel(recordArray);
}

async function runExecuteStatement(
  client: RedshiftDataClient,
  config: RedshiftConfig,
  sql: string
): Promise<string> {
  const response = await client.send(
    new ExecuteStatementCommand({
      ClusterIdentifier: config.clusterIdentifier,
      Database: config.database,
      DbUser: config.dbUser,
      Sql: sql,
    })
  );
  console.log("ExecuteStatement id:", response.Id);
  if (!response.Id) {
    throw new Error("ExecuteStatement returned no Id");
  }
  return response.Id;
}

async function pollUntilFinished(
  client: RedshiftDataClient,
  statementId: string
): Promise<string> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await client.send(
      new DescribeStatementCommand({ Id: statementId })
    );
    console.log("DescribeStatement status:", response.Status);
    if (response.Status === "FAILED") {
      throw new Error(
        "Redshift statement failed: " + (response.Error ?? "unknown error")
      );
    }
    if (response.Status === "FINISHED") {
      return statementId;
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error("Timed out waiting for Redshift statement to finish");
}

async function getRecordArray(
  client: RedshiftDataClient,
  subStatementId: string
): Promise<Field[][][]> {
  const recordArray: Field[][][] = [];
  let nextToken: string | undefined = undefined;

  do {
    const response = await client.send(
      new GetStatementResultCommand({
        Id: subStatementId,
        NextToken: nextToken,
      })
    );
    console.log("GetStatementResult nextToken:", response.NextToken);
    if (response.Records) {
      recordArray.push(response.Records as Field[][]);
    }
    nextToken = response.NextToken;
  } while (nextToken);

  return recordArray;
}

async function fillExcel(recordArray: Field[][][]): Promise<void> {
  const rows: (string | number | boolean | null)[][] = [];

  for (const page of recordArray) {
    for (const columns of page) {
      const row: (string | number | boolean | null)[] = columns.map(getFieldValue);
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return;
  }

  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const startRow = 1;
    const startCol = 0;
    const numRows = rows.length;
    const numCols = rows[0].length;

    const range = sheet.getRangeByIndexes(startRow, startCol, numRows, numCols);
    range.values = rows;
    await context.sync();
  });
}

function getFieldValue(field: Field): string | number | boolean | null {
  // Cast to plain object to avoid discriminated-union narrowing issues
  const f = field as unknown as Record<string, unknown>;
  if (f["isNull"]) return null;
  if (f["stringValue"] != null) return f["stringValue"] as string;
  if (f["longValue"] != null) return f["longValue"] as number;
  if (f["doubleValue"] != null) return f["doubleValue"] as number;
  if (f["booleanValue"] != null) return f["booleanValue"] as boolean;
  if (f["blobValue"] != null) return String(f["blobValue"]);
  console.log("Cannot find value for field:", JSON.stringify(field));
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
