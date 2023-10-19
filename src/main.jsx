import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Realtime } from "ably";

import { AblyProvider } from "ably/react";
import Spaces from '@ably/spaces';
import { SpacesProvider, SpaceProvider } from "@ably/spaces/dist/mjs/react/index.js";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import './index.css'

const client = new Realtime.Promise({ authUrl: "/api/token/" });
const spaces = new Spaces(client);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AblyProvider client={client}>
    <SpacesProvider client={spaces}>
      <SpaceProvider
          name="datagrid"
          options={{ offlineTimeout: 10_000 }}
        >
      <App />
      </SpaceProvider>
    </SpacesProvider>
  </AblyProvider>
  // </React.StrictMode>,
);
