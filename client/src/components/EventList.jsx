import React, { useState, useEffect, useContext } from 'react';
import { Users, Calendar, Clock, Edit2, FileText, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileProvider';
import { EventContext } from '../context/EventProvider';
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES = {
    ET: "America/New_York",
    CT: "America/Chicago",
    MT: "America/Denver",
    PT: "America/Los_Angeles",
    HT: "Pacific/Honolulu",
    GMT: "UTC",
    IT: "Asia/Kolkata",
    JT: "Asia/Tokyo",
    KT: "Asia/Seoul",
    NT: "America/St_Johns",
};

const EventList = () => {
    const navigate = useNavigate();
    const { selectedUser } = useContext(ProfileContext);
    const { events, setEvents } = useContext(EventContext);
    const [activeLogId, setActiveLogId] = useState(null);
    const [tz, setTz] = useState(TIMEZONES.ET);

    useEffect(() => {
        if (!selectedUser || selectedUser.length === 0) {
            setEvents([])
            return
        }
        const getEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getEvent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "users": selectedUser }),
                });
                const data = await response.json();
                console.log(data)
                setEvents(data);
            } catch (err) {
                console.log(err);
            }
        };
        getEvents();
    }, [selectedUser]);


    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col max-h-[500px]">
            <h2 className="text-xl font-semibold mb-4">Events</h2>

            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">View in Timezone</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                        setTz(TIMEZONES[e.target.value])
                    }}>
                    <option value="ET">Eastern Time (ET)</option>
                    <option value="CT">Central Time (CT)</option>
                    <option value="MT">Mountain Time (MT)</option>
                    <option value="PT">Pacific Time (PT)</option>
                    <option value="HT">Hawaii Time (HT)</option>
                    <option value="GMT">GMT / UTC</option>
                    <option value="IT">Indian Time (IST)</option>
                    <option value="JT">Japan Time</option>
                    <option value="KT">Korea Time</option>
                    <option value="NT">Newfoundland Time</option>
                </select>
            </div>

            <div className="grow overflow-y-auto space-y-3">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <div className="p-3 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {event.users?.map(u => u.name).join(', ')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-medium text-gray-700">Start</div>
                                            <div className="text-sm text-gray-900">
                                                {dayjs(event.start).tz(tz).format('YYYY-MM-DD')}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {dayjs(event.end).tz(tz).format('HH:mm')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-medium text-gray-700">End</div>
                                            <div className="text-sm text-gray-900">
                                                {dayjs(event.end).tz(tz).format('YYYY-MM-DD')}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {dayjs(event.end).tz(tz).format('HH:mm')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border-t border-gray-100 p-2 flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <div className="text-[10px] text-gray-400">
                                        Created: {dayjs(event.createdAt).tz(tz).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer" onClick={() => navigate(`/edit/${event.id}`)}>
                                        <Edit2 className="w-3 h-3" />
                                        Edit
                                    </button>
                                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm cursor-pointer" onClick={async () => {
                                        try {
                                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deleteEvent/${event.id}`, {
                                                method: 'DELETE',
                                            });
                                            if (response.ok) {
                                                setEvents(events.filter(e => e.id !== event.id));
                                                toast.success("Event deleted successfully");
                                            } else {
                                                console.error("Failed to delete");
                                                toast.error("Failed to delete event");
                                            }
                                        } catch (error) {
                                            console.error("Error deleting event", error);
                                        }
                                    }}>
                                        <Trash className="w-3 h-3" />
                                        Delete
                                    </button>
                                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer" onClick={() => setActiveLogId(activeLogId === event.id ? null : event.id)}>
                                        <FileText className="w-3 h-3" />
                                        Logs
                                    </button>
                                </div>
                            </div>
                            {activeLogId === event.id && (
                                <div className="bg-gray-50 p-3 text-xs border-t border-gray-200 animate-in slide-in-from-top-1 duration-200">
                                    <p className="font-medium text-gray-500 mb-1">Recent Updates</p>
                                    <div className="flex justify-between items-center text-gray-700">
                                        <span>Last modified</span>()
                                        <div className="text-sm text-gray-900">
                                            {dayjs(event.start).tz(tz).format('YYYY-MM-DD')}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dayjs(event.start).tz(tz).format('HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 min-h-[100px]">
                        <p>No events found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
