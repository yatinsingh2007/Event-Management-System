import React from 'react';

const EventList = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">Events</h2>

            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">View in Timezone</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Eastern Time (ET)</option>
                </select>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
                <p>No events found</p>
            </div>
        </div>
    );
};

export default EventList;
