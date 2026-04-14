/* global Excel console */

export async function readCell(address: string): Promise<string> {
  return Excel.run(async (context) => {
    const range = context.workbook.worksheets.getActiveWorksheet().getRange(address);
    range.load("values");
    await context.sync();
    return String(range.values[0][0]);
  });
}
