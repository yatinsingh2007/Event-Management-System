import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route , BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditEventPage from './components/EditEventPage';

function App() {
    return (
    <BrowserRouter>
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800 min-w-screen">
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/edit/:eventId" element={<EditEventPage />} />
            </Routes>
        </div>
    </BrowserRouter>
    )
}

export default App;
