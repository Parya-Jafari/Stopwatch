import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App-V2";
// import App from "./App-V1";


const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App initialSeconds={10} />
  </React.StrictMode>
);
