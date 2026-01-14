import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditProfileSelector from './EditProfileSelector';
import { EditProfileContext } from '../context/EditProfile';

const EditEventForm = ({ eventId }) => {
    const navigate = useNavigate();
    const { selectEditedUser, setSelectEditedUser } = useContext(EditProfileContext);
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("09:00");
    const [loading, setLoading] = useState(false);

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
                        setStartTime(start.toTimeString().slice(0, 5));
                        setEndDate(end.toISOString().split('T')[0]);
                        setEndTime(end.toTimeString().slice(0, 5));
                        const userNames = data.users.map(u => u.name);
                        setEditSelectedUser(userNames);
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

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        const currentSelectedUsers = editSelectedUser || [];

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/updateEvent/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "users": currentSelectedUsers,
                    "startAt": startDate + "T" + startTime,
                    "endAt": endDate + "T" + endTime
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
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Edit Event</h2>

            <form className="space-y-5" onSubmit={handleFormSubmission}>
                <div className="space-y-4">
                    <EditProfileSelector key={JSON.stringify(editSelectedUser)} />
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
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" value={startDate} placeholder="Pick a date" min={new Date().toISOString().split("T")[0]} onChange={(e) => {
                                setStartDate(e.target.value);
                            }} />
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" value={startTime} onChange={(e) => {
                                setStartTime(e.target.value);
                            }} />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" value={endDate} placeholder="Pick a date" min={new Date().toISOString().split("T")[0]} onChange={(e) => {
                                setEndDate(e.target.value);
                            }} />
                        </div>
                        <div className="relative">
                            <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500" value={endTime} onChange={(e) => {
                                setEndTime(e.target.value);
                            }} />
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
