import React, { useState } from "react";
import { Button } from "@fluentui/react-components";

/* global Office */

const DisplayRolesPane: React.FC = () => {
  const [accountType, setAccountType] = useState<string | null>(null);

  const handleDisplayRoles = () => {
    const type = (Office.context as any).userProfile.accountType;
    setAccountType(type);
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleDisplayRoles}>
        Display Roles
      </Button>
      {accountType !== null && <p>{accountType}</p>}
    </div>
  );
};

export default DisplayRolesPane;
