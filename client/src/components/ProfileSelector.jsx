import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { ProfileContext } from '../context/ProfileProvider';

const ProfileSelector = () => {
    const [userData, setUserData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isAddClick, setIsAddClick] = useState(false);
    const [newName, setNewName] = useState("");
    const [addLoader, setAddLoader] = useState(false);
    const { selectedUser, setSelectedUser } = useContext(ProfileContext);

    const handleProfileClick = async (e) => {
        e.preventDefault();
        try {
            setShowDropDown(!showDropDown);
            if (!showDropDown && userData.length === 0) {
                setLoader(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getAllUsers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setUserData(data);
                setFilteredData(data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.value;
        if (searchValue.trim() === "") {
            setFilteredData(userData);
            return;
        }
        const filteredData = userData.filter((user) => {
            return user.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        setFilteredData(filteredData);
    };

    return (
        <div className="relative">
            <div
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px]"
                onClick={handleProfileClick}
            >
                {selectedUser.length === 0 ? "Select profile's" : selectedUser.join(", ")}
            </div>
            {showDropDown && (
                <div className='absolute z-10 bg-white rounded-md shadow-lg right-0 mt-1 w-56 md:w-72 border border-gray-100 md:right-72'>
                    <div className="p-2">
                        <input
                            type='text'
                            placeholder='Search'
                            className='w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm mb-2'
                            onChange={handleSearch}
                        />
                    </div>
                    <div className='p-2 flex flex-col max-h-60 overflow-y-auto scrollbar-thin'>
                        {loader ? (
                            <div className='flex justify-center p-4'>
                                <div className='rounded-full w-5 h-5 border-2 border-t-black animate-spin border-gray-100'></div>
                            </div>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((user, i) => (
                                <div key={i} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                                    <input type="checkbox" name={user.name} id={`hi-${i}`} className="rounded text-indigo-600" onClick={() => {
                                        if (!selectedUser.includes(user.name)) {
                                            setSelectedUser([...selectedUser, user.name]);
                                        } else {
                                            setSelectedUser(selectedUser.filter((name) => name !== user.name));
                                        }
                                    }} defaultChecked={selectedUser.includes(user.name)} />
                                    <label htmlFor={`hi-${i}`} className="text-sm text-gray-700 cursor-pointer flex-1">{user.name}</label>
                                </div>
                            ))
                        ) : (
                            <p className='text-center w-full text-sm text-gray-500 py-2'>No data found</p>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        {isAddClick && <input type='text' placeholder='Enter profile name' className='w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm mb-2' onChange={(e) => setNewName(e.target.value)} />}
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md w-full text-sm font-medium transition-colors flex justify-between items-center" onClick={async (e) => {
                            e.preventDefault();
                            if (isAddClick && newName.length == 0) {
                                setIsAddClick(false);
                                return;
                            };
                            setIsAddClick(true);
                            try {
                                setAddLoader(true)
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/createUser`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ "name": newName }),
                                });
                                const data = await response.json();
                                if (response.ok) {
                                    setUserData([...userData, data]);
                                    setFilteredData([...userData, data]);
                                    toast.success('Profile added successfully');
                                    setNewName("");
                                    e.target.value = "";
                                } else {
                                    toast.error(data.error || "Failed to add profile");
                                }
                            } catch (err) {
                                console.log(err);
                                toast.error("An error occurred");
                            } finally {
                                setAddLoader(false)
                            }
                        }}>
                            {addLoader ? <div className='rounded-full w-5 h-5 border-2 border-t-black animate-spin border-gray-100'></div> : "Add Profile"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelector;