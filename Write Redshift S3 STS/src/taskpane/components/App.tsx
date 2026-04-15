import * as React from "react";
import WriteRedshiftPane from "./WriteRedshiftPane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <WriteRedshiftPane />
    </div>
  );
};

export default App;
