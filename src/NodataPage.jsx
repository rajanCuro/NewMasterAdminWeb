import React, { useState } from "react";
import noDataImage from "./assets/nodata.png"; // 🔁 Replace with your actual path

const NoDataPage = ({name}) => {
    return (
        <div className="flex justify-center items-center w-full  px-4">
            <div className="flex flex-col items-center justify-center p-4 w-1/2 ">
                <div className="w-full animate-fade-in flex flex-col items-center">
                    <img
                        src={noDataImage}
                        alt="No data"
                        className="w-48 h-48 mb-6 animate-fade-in"
                    />
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                        Nothing Here Yet {name}
                    </h2>
                    {/* <button className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm">Please Try Again</button> */}
                </div>
            </div>
        </div>

    );
};

export default NoDataPage;
