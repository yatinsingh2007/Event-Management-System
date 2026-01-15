import { createContext, useState } from "react";
import React from "react";

const EventContext = createContext(null);

const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    return (
        <EventContext.Provider value={{ events, setEvents }}>
            {children}
        </EventContext.Provider>
    );
};

export { EventContext , EventProvider }