import { createContext, useState } from "react";


const OtherProfileContext = createContext(null);


const OtherProfileProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("otherSelectedUser")) || []);
    return (
        <OtherProfileContext.Provider value={{ selectedUser, setSelectedUser }}>
            {children}
        </OtherProfileContext.Provider>
    )
}

export { OtherProfileProvider, OtherProfileContext }
