/* global Excel console */

export async function writeCell(address: string, value: string): Promise<void> {
  await Excel.run(async (context) => {
    const range = context.workbook.worksheets.getActiveWorksheet().getRange(address);
    range.values = [[value]];
    range.format.autofitColumns();
    await context.sync();
  });
}
