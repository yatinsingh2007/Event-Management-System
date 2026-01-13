import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditEventPage from './components/EditEventPage';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/edit/:eventId" element={<EditEventPage />} />
            </Routes>
        </div>
    )
}

export default App;
