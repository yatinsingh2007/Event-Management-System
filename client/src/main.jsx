import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"

import { BrowserRouter } from 'react-router-dom';

import { ProfileProvider } from "./context/ProfileProvider.jsx";
import { EventProvider } from "./context/EventProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </EventProvider>
  </StrictMode>,
)

