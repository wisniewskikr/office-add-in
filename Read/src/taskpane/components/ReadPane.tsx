import React, { useState } from "react";
import { Button } from "@fluentui/react-components";

/* global Excel */

const ReadPane: React.FC = () => {
  const [cellValue, setCellValue] = useState<string | null>(null);

  const handleRead = async () => {
    await Excel.run(async (context) => {
      const range = context.workbook.worksheets.getActiveWorksheet().getRange("A1");
      range.load("values");
      await context.sync();
      setCellValue(String(range.values[0][0]));
    });
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleRead}>
        Read from A1 cell
      </Button>
      {cellValue !== null && <p>{cellValue}</p>}
    </div>
  );
};

export default ReadPane;
