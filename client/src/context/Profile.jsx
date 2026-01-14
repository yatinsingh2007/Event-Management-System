import { createContext, useState , useEffect } from "react";


const ProfileContext = createContext(null);



const ProfileProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("selectedUser")) || []);
    useEffect(() => {
        localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    } , [selectedUser])
    return (
        <ProfileContext.Provider value={{ selectedUser, setSelectedUser }}>
            {children}
        </ProfileContext.Provider>
    )
}


export { ProfileProvider, ProfileContext }
