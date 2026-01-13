import React from 'react';
import Header from './Header';
import ProfileSelector from './ProfileSelector';
import CreateEventForm from './CreateEventForm';
import EventList from './EventList';

const Dashboard = () => {
    return (
        <div>
            <div className="mx-auto max-w-6xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Header />
                <ProfileSelector />
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CreateEventForm />
                <EventList />
            </div>
        </div>
    );
};

export default Dashboard;
