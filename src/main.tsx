import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import JadwalKSL from "./components/JadwalKSL";
import DaftarKSL from "./components/DaftarKSL";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";


const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/jadwal-ksl" element={<JadwalKSL />} />
          <Route path="/daftar-ksl" element={<DaftarKSL />} />
        </Routes>
      </MsalProvider>
    </React.StrictMode>
  </BrowserRouter>
);
