import * as React from "react";
import ReadPane from "./ReadPane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <ReadPane />
    </div>
  );
};

export default App;
