import React from 'react';
import Header from './components/Header';
import ProfileSelector from './components/ProfileSelector';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="mx-auto max-w-6xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Header />
                <ProfileSelector />
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CreateEventForm />
                <EventList />
            </div>
        </div>
    )
}

export default App;
