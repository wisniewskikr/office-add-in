import * as React from "react";
import WritePane from "./WritePane";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => (
  <div>
    <WritePane />
  </div>
);

export default App;
