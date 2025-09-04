import React, { useEffect, useState } from 'react';
import Map from '../Map/Map'

import stompClient from '../../ws/socket';
import FieldExecutiveMap from './FieldExecutiveMap';

function DistanceInfo({ data }) {
    const [mapData, setMapData] = useState(null)
    if (!data) {
        return <div className="text-gray-500 p-4">No data available</div>;
    }

    useEffect(() => {
        stompClient.onConnect = () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/field-executive-location', (message) => {
                const payload = JSON.parse(message.body);
                console.log('Received location:', payload);
                setMapData(payload)
            });
        };
        stompClient.activate();
        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, []);

    const {
        totalTravelDistance = 0,
        totalVisits = 0,
        totalCompletedTasks = 0,
        firstName,
        lastName
    } = data;

    return (
        <div className="flex flex-col lg:flex-row gap-1 p-2 ">
            {/* <WebSocketComponent /> */}
            {/* Metrics Panel */}
            <div className="w-full lg:w-1/4 xl:w-1/4 flex flex-col gap-3 p-3 md:p-4 border border-gray-300 rounded-2xl bg-white shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    Distance & Performance Metrics
                    {firstName && lastName && (
                        <span className="block text-sm text-gray-600 mt-1">
                            for {firstName} {lastName}
                        </span>
                    )}
                </h2>

                {/* Total Travel Distance */}
                <div className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xs md:text-sm font-medium text-gray-600">Total Distance</h3>
                        <span className="text-lg md:text-xl font-bold text-blue-700">{totalTravelDistance} km</span>
                    </div>
                </div>

                {/* Total Visits */}
                <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xs md:text-sm font-medium text-gray-600">Total Visits</h3>
                        <p className="text-lg md:text-xl font-bold text-green-700">{totalVisits}</p>
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="flex items-center gap-3 p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xs md:text-sm font-medium text-gray-600">Completed Tasks</h3>
                        <p className="text-lg md:text-xl font-bold text-purple-700">{totalCompletedTasks}</p>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="mt-2 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Performance Summary</h3>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1">
                        <p>Avg. distance/visit: {totalVisits > 0 ? (totalTravelDistance / totalVisits).toFixed(2) : 0} km</p>
                        <p>Completion rate: {totalVisits > 0 ? ((totalCompletedTasks / totalVisits) * 100).toFixed(1) : 0}%</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className='w-full lg:w-3/4 xl:w-3/4 h-80 md:h-96 lg:h-auto'>
                <FieldExecutiveMap location={mapData} />
                {/* <Map location={mapData} data={'mapE'} /> */}
            </div>
        </div>
    );
}

export default DistanceInfo;