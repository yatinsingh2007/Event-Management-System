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


  const [startUTC, setStartUTC] = useState(
    dayjs().tz(TIMEZONES.ET).utc()
  );
  const [endUTC, setEndUTC] = useState(
    dayjs().tz(TIMEZONES.ET).add(1, "hour").utc()
  );

  const [loading, setLoading] = useState(false);

  const { events, setEvents } = useContext(EventContext);


  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem("otherProfileSelectedUser");
    const selectedUser = storedUsers ? JSON.parse(storedUsers) : [];

    if (!selectedUser.length) {
      toast.error("Please select at least one profile");
      return;
    }

    const startAt = startUTC.toISOString();
    const endAt = endUTC.toISOString();

    if (dayjs(endAt).isBefore(startAt)) {
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
            "users": selectedUser,
            "startAt": startAt,
            "endAt": endAt,
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

        <div className="max-w-96">
          <label className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            className="w-full border border-gray-300 rounded-md sm:px-3 sm:py-2 py-2.5 px-0.5"
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
          <div className="flex gap-3 sm:flex-nowrap flex-wrap">
            <input
              type="date"
              value={startUTC.tz(selectedTZ).format("YYYY-MM-DD")}
              onChange={(e) => {
                const newDate = e.target.value;
                const current = startUTC.tz(selectedTZ);
                const newUTC = dayjs.tz(`${newDate}T${current.format("HH:mm")}`, selectedTZ).utc();
                setStartUTC(newUTC);
              }}
              className="border rounded sm:px-3 sm:py-2 py-1 w-full px-0.5"
            />
            <input
              type="time"
              value={startUTC.tz(selectedTZ).format("HH:mm")}
              onChange={(e) => {
                const newTime = e.target.value;
                const current = startUTC.tz(selectedTZ);
                const newUTC = dayjs.tz(`${current.format("YYYY-MM-DD")}T${newTime}`, selectedTZ).utc();
                setStartUTC(newUTC);
                }}
                className="border rounded sm:px-3 sm:py-2 py-1 w-full px-0.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date & Time
          </label>
          <div className="flex gap-3 sm:flex-nowrap flex-wrap">
            <input
              type="date"
              value={endUTC.tz(selectedTZ).format("YYYY-MM-DD")}
              onChange={(e) => {
                const newDate = e.target.value;
                const current = endUTC.tz(selectedTZ);
                const newUTC = dayjs.tz(`${newDate}T${current.format("HH:mm")}`, selectedTZ).utc();
                setEndUTC(newUTC);
              }}
              className="border rounded sm:px-3 sm:py-2 py-1 w-full px-0.5"
            />
            <input
              type="time"
              value={endUTC.tz(selectedTZ).format("HH:mm")}
              onChange={(e) => {
                const newTime = e.target.value;
                const current = endUTC.tz(selectedTZ);
                const newUTC = dayjs.tz(`${current.format("YYYY-MM-DD")}T${newTime}`, selectedTZ).utc();
                setEndUTC(newUTC);
              }}
              className="border rounded sm:px-3 sm:py-2 py-1 w-full px-0.5"
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
