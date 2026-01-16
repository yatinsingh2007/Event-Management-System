import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditProfileSelector from './EditProfileSelector';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

const EditEventForm = ({ eventId }) => {
    const navigate = useNavigate();
    const [startUTC , setStartUTC] = useState(dayjs().tz(TIMEZONES.ET).utc())
    const [endUTC , setEndUTC] = useState(dayjs().tz(TIMEZONES.ET).add(1 , "hour").utc())
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [tz , setTz] = useState(TIMEZONES.ET)

    useEffect(() => {
        if (!eventId) return;
        else {
            const fetchEvent = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getEvent/${eventId}`);
                    const data = await response.json();
                    if (response.ok) {
                        const start = new Date(data.start);
                        const end = new Date(data.end);

                        setStartDate(start.toISOString().split('T')[0]);
                        setEndDate(end.toISOString().split('T')[0]);
                        setStartTime(start.toTimeString().slice(0, 5));
                        setEndTime(end.toTimeString().slice(0, 5));

                        const userNames = data.users.map(u => u.name);
                        localStorage.setItem('editProfileSelectedUser', JSON.stringify(userNames));
                        setDataLoaded(true);
                    } else {
                        toast.error("Failed to fetch event details");
                    }
                } catch (err) {
                    console.log(err);
                    toast.error("Error fetching event");
                }
            };
            fetchEvent();
        }
    }, [eventId]);

    useEffect(() => {

    }, [tz]);


    const handleFormSubmission = async (e) => {
        e.preventDefault();

        const storedUsers = localStorage.getItem('editProfileSelectedUser');
        const currentSelectedUsers = storedUsers ? JSON.parse(storedUsers) : [];

        if (currentSelectedUsers.length === 0) {
            toast.error("Please select at least one profile");
            return;
        }
        const startAt = startUTC.toISOString();
        const endAt = endUTC.toISOString();

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/updateEvent/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "users": currentSelectedUsers,
                    "startAt": startAt ,
                    "endAt": endAt,
                })
            })
            const data = await response.json();
            if (response.ok) {
                toast.success('Event updated successfully!');
                navigate('/');
            } else {
                toast.error(data.error || 'Failed to update event');
            }
        } catch (err) {
            console.log(err)
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const handleTimezoneChange = (e) => {
        setTz(TIMEZONES[e.target.value]);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">Edit Event</h2>

            <form className="space-y-5" onSubmit={handleFormSubmission}>
                <div className="space-y-4">
                    {dataLoaded && <EditProfileSelector />}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Timezone
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        onChange={handleTimezoneChange}
                        defaultValue="ET"
                    >
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
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" placeholder="Pick a date" min={new Date().toISOString().split("T")[0]} onChange={(e) => {
                                const newDate = e.target.value;
                                const present = dayjs().tz(tz);
                                const newDateUTC = dayjs.tz(`${newDate}T${present.format("HH:mm")}`, tz).utc();
                                setStartUTC(newDateUTC);
                            }} value={startUTC.tz(tz).format("YYYY-MM-DD")}/>
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" onChange={(e) => {
                                const newTime = e.target.value;
                                const present = dayjs().tz(tz);
                                const newDateUTC = dayjs.tz(`${present.format("YYYY-MM-DD")}T${newTime}`, tz).utc();
                                setStartUTC(newDateUTC);
                            }} value={startUTC.tz(tz).format("HH:mm")}/>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"  placeholder="Pick a date" min={new Date().toISOString().split("T")[0]} onChange={(e) => {
                                const newDate = e.target.value;
                                const present = dayjs().tz(tz);
                                const newDateUTC = dayjs.tz(`${newDate}T${present.format("HH:mm")}`, tz).utc();
                                setEndUTC(newDateUTC);
                            }} value={endUTC.tz(tz).format("YYYY-MM-DD")}/>
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"  onChange={(e) => {
                                const newTime = e.target.value;
                                const present = dayjs().tz(tz);
                                const newDateUTC = dayjs.tz(`${present.format("YYYY-MM-DD")}T${newTime}`, tz).utc();
                                setEndUTC(newDateUTC);
                            }} value={endUTC.tz(tz).format("HH:mm")}/>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors disabled:opacity-50">
                        {loading ? 'Processing...' : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEventForm;
