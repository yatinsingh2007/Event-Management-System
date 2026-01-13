import React from 'react';

const CreateEventForm = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Create Event</h2>

            <form className="space-y-5">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Profiles</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select profiles...</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Eastern Time (ET)</option>
                        <option>Pacific Time (PT)</option>
                        <option>Coordinated Universal Time (UTC)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" placeholder="Pick a date" />
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" defaultValue="09:00" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" placeholder="Pick a date" />
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" defaultValue="09:00" />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors">
                        + Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventForm;
