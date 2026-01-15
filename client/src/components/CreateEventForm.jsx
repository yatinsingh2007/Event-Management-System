import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditProfileSelector from "./EditProfileSelector";
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

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");
  const [selectedTZ, setSelectedTZ] = useState(TIMEZONES.ET);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/getEvent/${eventId}`
        );
        const data = await response.json();

        if (!response.ok) {
          toast.error("Failed to fetch event details");
          return;
        }

        const start = dayjs.utc(data.start).tz(selectedTZ);
        const end = dayjs.utc(data.end).tz(selectedTZ);

        setStartDate(start.format("YYYY-MM-DD"));
        setStartTime(start.format("HH:mm"));
        setEndDate(end.format("YYYY-MM-DD"));
        setEndTime(end.format("HH:mm"));

        const userNames = data.users.map((u) => u.name);
        localStorage.setItem(
            "editProfileSelectedUser",
            JSON.stringify(userNames)
        );

        setDataLoaded(true);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching event");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem("editProfileSelectedUser");
    const selectedUsers = storedUsers ? JSON.parse(storedUsers) : [];

    if (!selectedUsers.length) {
      toast.error("Please select at least one profile");
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Please fill in all date and time fields");
      return;
    }

    const startUTC = dayjs
        .tz(`${startDate} ${startTime}`, selectedTZ)
        .utc()
        .toISOString();

    const endUTC = dayjs
        .tz(`${endDate} ${endTime}`, selectedTZ)
        .utc()
        .toISOString();

    if (dayjs(endUTC).isBefore(startUTC)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/updateEvent/${eventId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              users: selectedUsers,
              startAt: startUTC,
              endAt: endUTC,
            }),
          }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update event");
        return;
      }

      toast.success("Event updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Edit Event</h2>

        <form className="space-y-5" onSubmit={handleFormSubmission}>
          {dataLoaded && <EditProfileSelector />}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={Object.keys(TIMEZONES).find(
                    (key) => TIMEZONES[key] === selectedTZ
                )}
                onChange={(e) => setSelectedTZ(TIMEZONES[e.target.value])}
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
                  min={startDate}
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Update Event"}
          </button>
        </form>
      </div>
  );
};

export default EditEventForm;
