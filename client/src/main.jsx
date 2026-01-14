import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx"

import { BrowserRouter } from 'react-router-dom';

import { ProfileProvider } from "./context/Profile.jsx";
import { EditProfileProvider } from "./context/EditProfile.jsx";
import { OtherProfileProvider } from "./context/OtherProfile.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProfileProvider>
        <EditProfileProvider>
          <OtherProfileProvider>
            <App />
          </OtherProfileProvider>
        </EditProfileProvider>
      </ProfileProvider>
    </BrowserRouter>
  </StrictMode>,
)
