import React from "react";
import { Button } from "@fluentui/react-components";

const ReadRedshiftPane: React.FC = () => {
  const handleReadFromRedshift = () => {
    // Placeholder — no action yet
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleReadFromRedshift}>
        Read from Redshift
      </Button>
    </div>
  );
};

export default ReadRedshiftPane;
