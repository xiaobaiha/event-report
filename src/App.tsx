import React from "react";
import { Route, Redirect } from "react-router-dom";
import A from "./pages/A";
import B from "./pages/B";
import EventSDK, { useEventCollect } from "./sdk";

EventSDK.config({});

const App: React.FC = () => {
  useEventCollect();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Redirect path="/" to="/page/a" />
      <Route path="/page/a" component={A} />
      <Route path="/page/b" component={B} />
    </div>
  );
};

export default App;
