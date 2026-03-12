import React, { useState } from "react";
import { Button, Input, Label } from "@fluentui/react-components";

/* global Excel */

const WritePane: React.FC = () => {
  const [name, setName] = useState<string>("");

  const handleWrite = async () => {
    await Excel.run(async (context) => {
      const range = context.workbook.worksheets.getActiveWorksheet().getRange("A1");
      range.values = [[`Hello World ${name}`]];
      range.format.autofitColumns();
      await context.sync();
    });
  };

  return (
    <div>
      <Label htmlFor="nameInput">Name</Label>
      <Input
        id="nameInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <Button appearance="primary" onClick={handleWrite}>
        Write to A1 cell
      </Button>
    </div>
  );
};

export default WritePane;
