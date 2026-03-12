import React, { useState } from "react";
import { Button } from "@fluentui/react-components";

/* global Office */

const DisplayUsernamePane: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  const handleDisplayUsername = () => {
    const name = Office.context.userProfile.displayName;
    setUsername(name);
  };

  return (
    <div>
      <Button appearance="primary" onClick={handleDisplayUsername}>
        Display Username
      </Button>
      {username !== null && <p>{username}</p>}
    </div>
  );
};

export default DisplayUsernamePane;
