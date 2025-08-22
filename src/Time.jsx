import React, { useState, useEffect } from 'react';

function Time() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update the time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Format the date as "21 Aug"
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${month}`;
    };

    // Format the time as "HH:MM:SS AM/PM"
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Get the full day name
    const getDayName = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <>
            <div className='flex justify-start items-center gap-2' >
                <span className="text-sm font-mono font-bold text-blue-600" > {formatTime(currentTime)}</span>
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <span>{formatDate(currentTime)}</span>
                    <span className="text-gray-400">•</span>
                    <span>{getDayName(currentTime)}</span>
                </div>
            </div>


        </>
    );
}

export default Time;