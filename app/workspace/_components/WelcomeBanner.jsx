import React from "react";
import NotificationBell from "./NotificationBell";

function WelcomeBanner(){
    return (
        <div className='p-5 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800 rounded-xl mb-10 text-white'>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className='font-bold text-2xl'>Welcome to Online Learning Platform</h2>
                    <p className='opacity-90'>Learn, Create and Explore Your favorite courses</p>
                </div>
                <NotificationBell />
            </div>
        </div>
    )
}

export default WelcomeBanner