import * as React from "react";
import DisplayUsernamePane from "./DisplayUsernamePane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <DisplayUsernamePane />
    </div>
  );
};

export default App;
