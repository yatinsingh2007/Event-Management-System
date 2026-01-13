import './App.css'
import React from "react"
import { useState , useEffect } from "react";

function App() {
    const [isMobile , setIsMobile] = useState(false);
    const [users , setUsers] = useState([]);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        }
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => { window.removeEventListener("resize", checkMobile); };
    } , []);
    const [showInput , setShowInput] = useState(false);
  return (
    <>
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-semibold p-4 md:text-2xl">Event Management</h1>
                <p className="text-md p-1 pl-4 text-grey md:text-sm">Create and Manage small events across multiple timezones</p>
            </div>
            <div className="pr-3">
                {showInput && <input type="text" placeholder="Search for Names" className="absolute"/>}
                <select className="relative" onSelect={()=>{setShowInput(!showInput)}} onClick={async (e) => {
                    e.preventDefault();
                    try {
                        const resp = await fetch("http://localhost:5000/api/getallUsers");
                        const data = await resp.json();
                        setUsers(data);
                    }catch(err) {
                        console.log(err);
                    }
                }}>
                    <option option>Select a User</option>
                </select>
            </div>
        </div>
        <div className={`flex justify-between items-center`}>
            <div></div>
            <div></div>
        </div>
    </>
  )
}

export default App
