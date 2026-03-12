import * as React from "react";
import DisplayRolesPane from "./DisplayRolesPane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <DisplayRolesPane />
    </div>
  );
};

export default App;
