import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Acc from "./Acc";
import Rsvp from "./Rsvp";
import "./index.css";

const path = window.location.pathname;
const Component = path.startsWith("/rsvp")
  ? Rsvp
  : path.startsWith("/acc")
  ? Acc
  : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
