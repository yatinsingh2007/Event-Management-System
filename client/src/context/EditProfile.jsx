import { createContext, useEffect, useState  }  from "react";
import React from "react";


const EditProfileContext = createContext(null);


const EditProfileProvider = ({ children }) => {
    const [selectEditedUser , setSelectEditedUser] = useState(JSON.parse(localStorage.getItem("editSelectedUser")) || []);
    useEffect(() => {
        localStorage.setItem("editSelectedUser", JSON.stringify(selectEditedUser));
    } , [selectEditedUser])
    return (
        <EditProfileContext.Provider value={{ selectEditedUser, setSelectEditedUser }}>
            {children}
        </EditProfileContext.Provider>
    )
}


export { EditProfileContext, EditProfileProvider }
