import * as React from "react";
import ReadRedshiftPane from "./ReadRedshiftPane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <ReadRedshiftPane />
    </div>
  );
};

export default App;
