import React from 'react';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="mx-auto max-w-6xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-500 mt-1">Create and manage events across multiple timezones</p>
                </div>
                <div>
                    <select className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select current profile...</option>
                    </select>
                </div>
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                                + Create Event
                            </button>
                        </div>
                    </form>
                </div>

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

            </div>
        </div>
    )
}

export default App
