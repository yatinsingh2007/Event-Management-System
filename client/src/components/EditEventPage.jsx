import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import ProfileSelector from './ProfileSelector';
import EditEventForm from './EditEventForm';

const EditEventPage = () => {
    const { eventId } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="mx-auto max-w-6xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Header />
                <ProfileSelector />
            </div>

            <div className="mx-auto max-w-2xl">
                <EditEventForm eventId={eventId} />
            </div>
        </div>
    );
};

export default EditEventPage;
