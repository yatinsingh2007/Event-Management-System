import React, { useState } from 'react';

const ProfileSelector = () => {
    const [userData, setUserData] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleProfileClick = async (e) => {
        e.preventDefault();
        try {
            setShowDropDown(!showDropDown); // Toggle instead of just setting true
            if (!showDropDown && userData.length === 0) { // Only fetch if opening and no data
                setLoader(true);
                const response = await fetch('http://localhost:5001/api/getAllUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setUserData(data);
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
        if (!searchValue) {
        }
        const filteredData = userData.filter((user) => {
            return user.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        setUserData(filteredData);
    };

    return (
        <div className="relative">
            <div
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px]"
                onClick={handleProfileClick}
            >
                Select profile's
            </div>
            {showDropDown && (
                <div className='absolute z-10 bg-white rounded-md shadow-lg right-0 mt-1 w-72 border border-gray-100'>
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
                        ) : userData.length > 0 ? (
                            userData.map((user, i) => (
                                <div key={i} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                                    <input type="checkbox" name={user.name} id={`user-${i}`} className="rounded text-indigo-600" />
                                    <label htmlFor={`user-${i}`} className="text-sm text-gray-700 cursor-pointer flex-1">{user.name}</label>
                                </div>
                            ))
                        ) : (
                            <p className='text-center w-full text-sm text-gray-500 py-2'>No data found</p>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md w-full text-sm font-medium transition-colors">
                            Add Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelector;
