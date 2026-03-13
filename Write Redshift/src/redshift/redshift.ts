/* global console */

import { readCell } from "../taskpane/taskpane";
import {
  RedshiftDataClient,
  ExecuteStatementCommand,
  DescribeStatementCommand,
} from "@aws-sdk/client-redshift-data";
import { RedshiftConfig } from "./configuration";
import { createRedshiftClient } from "./redshiftClient";

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ATTEMPTS = 60;

export async function writeToRedshift(config: RedshiftConfig): Promise<void> {
  const id = await readCell("A2");
  const message = await readCell("B2");
  const sql = `INSERT INTO GREETINGS (id, message) VALUES (${Number(id)}, '${String(message).replace(/'/g, "''")}')`;
  const client = createRedshiftClient(config);
  const statementId = await runExecuteStatement(client, config, sql);
  await pollUntilFinished(client, statementId);
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
