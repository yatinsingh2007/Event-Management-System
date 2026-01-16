import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import OtherProfileSelector from "./OtherProfileSelector";
import { EventContext } from "../context/EventProvider";
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

const CreateEventForm = () => {
  const [selectedTZ, setSelectedTZ] = useState(TIMEZONES.ET);

  const [startDate, setStartDate] = useState(() =>
    dayjs().tz(TIMEZONES.ET).format("YYYY-MM-DD")
  );

  const [startTime, setStartTime] = useState(() =>
    dayjs().tz(TIMEZONES.ET).format("HH:mm")
  );

  const [endDate, setEndDate] = useState(() =>
    dayjs().tz(TIMEZONES.ET).format("YYYY-MM-DD")
  );

  const [endTime, setEndTime] = useState(() =>
    dayjs().tz(TIMEZONES.ET).format("HH:mm")
  );
  const [loading, setLoading] = useState(false);

  const { events, setEvents } = useContext(EventContext);

  useEffect(() => {
    setStartDate(dayjs().tz(selectedTZ).format("YYYY-MM-DD"));
    setEndDate(dayjs().tz(selectedTZ).format("YYYY-MM-DD"));
    setStartTime(dayjs().tz(selectedTZ).format("HH:mm"));
    setEndTime(dayjs().tz(selectedTZ).format("HH:mm"));
  }, [selectedTZ]);


  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem("otherProfileSelectedUser");
    const selectedUser = storedUsers ? JSON.parse(storedUsers) : [];

    if (!selectedUser.length) {
      toast.error("Please select at least one profile");
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Please fill in all date and time fields");
      return;
    }

    const startUTC = dayjs
      .tz(`${startDate}T${startTime}`, selectedTZ)
      .utc()
      .toISOString();

    const endUTC = dayjs
      .tz(`${endDate}T${endTime}`, selectedTZ)
      .utc()
      .toISOString();

    if (dayjs(endUTC).isBefore(startUTC)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/createEvent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            users: selectedUser,
            startAt: startUTC,
            endAt: endUTC,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEvents([...events, data]);
        toast.success("Event created successfully!");
      } else {
        toast.error(data.error || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTimezoneChange = (e) => {
    setSelectedTZ(TIMEZONES[e.target.value]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Create Event</h2>

      <form className="space-y-5" onSubmit={handleFormSubmission}>
        <OtherProfileSelector />

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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date & Time
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={dayjs().tz(selectedTZ).format("YYYY-MM-DD")}
              className="border rounded px-3 py-2"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date & Time
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={dayjs().tz(selectedTZ).format("YYYY-MM-DD")}
              className="border rounded px-3 py-2"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          + Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;
