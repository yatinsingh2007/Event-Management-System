import { createContext, useState } from "react";
import React from "react";

const OtherProfileContext = createContext(null);


const OtherProfileProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("otherSelectedUser")) || []);
    useEffect(() => {
        localStorage.setItem("otherSelectedUser", JSON.stringify(selectedUser));
    } , [selectedUser])
    return (
        <OtherProfileContext.Provider value={{ selectedUser, setSelectedUser }}>
            {children}
        </OtherProfileContext.Provider>
    )
}

export { OtherProfileProvider, OtherProfileContext }
