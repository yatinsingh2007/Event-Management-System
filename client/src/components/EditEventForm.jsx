import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditProfileSelector from './EditProfileSelector';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEventForm = ({ eventId }) => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("09:00");
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const USER_TZ = dayjs.tz.guess(); // local timezone

    useEffect(() => {
        if (!eventId) return;

        const fetchEvent = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/getEvent/${eventId}`
                );
                const data = await response.json();

                if (response.ok) {
                    const start = dayjs.utc(data.start).tz(USER_TZ);
                    const end = dayjs.utc(data.end).tz(USER_TZ);

                    setStartDate(start.format("YYYY-MM-DD"));
                    setStartTime(start.format("HH:mm"));
                    setEndDate(end.format("YYYY-MM-DD"));
                    setEndTime(end.format("HH:mm"));

                    const userNames = data.users.map(u => u.name);
                    localStorage.setItem(
                        'editProfileSelectedUser',
                        JSON.stringify(userNames)
                    );

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
    }, [eventId]);

    const handleFormSubmission = async (e) => {
        e.preventDefault();

        const storedUsers = localStorage.getItem('editProfileSelectedUser');
        const currentSelectedUsers = storedUsers ? JSON.parse(storedUsers) : [];

        if (currentSelectedUsers.length === 0) {
            toast.error("Please select at least one profile");
            return;
        }

        if (!startDate || !startTime || !endDate || !endTime) {
            toast.error("Please fill in all date and time fields");
            return;
        }

        try {
            setLoading(true);

            const startAtUTC = dayjs
                .tz(`${startDate} ${startTime}`, USER_TZ)
                .utc()
                .toISOString();

            const endAtUTC = dayjs
                .tz(`${endDate} ${endTime}`, USER_TZ)
                .utc()
                .toISOString();

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/updateEvent/${eventId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        users: currentSelectedUsers,
                        startAt: startAtUTC,
                        endAt: endAtUTC
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success('Event updated successfully!');
                navigate('/');
            } else {
                toast.error(data.error || 'Failed to update event');
            }
        } catch (err) {
            console.log(err);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Edit Event</h2>

            <form className="space-y-5" onSubmit={handleFormSubmission}>
                <div className="space-y-4">
                    {dataLoaded && <EditProfileSelector />}
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Start Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                        <input
                            type="time"
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        End Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                        <input
                            type="time"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Update Event'}
                </button>
            </form>
        </div>
    );
};

export default EditEventForm;