import React from "react";

const Loader = () => {
    return (
        <div className=" flex flex-col items-center justify-center">

            <div className="bg-white rounded-2xl  p-8 max-w-md w-full">
                {/* <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Loading Content</h2> */}

                {/* Loader Container */}
                <div className="flex justify-center items-center my-8">
                    <div className="relative">
                        {/* Outer rotating circle */}
                        <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>

                        {/* Middle rotating circle */}
                        {/* <div className="absolute top-3 left-3 w-18 h-18 border-4 border-indigo-200 border-r-indigo-500 rounded-full animate-spin-reverse animation-delay-200"></div> */}

                        {/* Inner rotating circle */}
                        {/* <div className="absolute top-6 left-6 w-12 h-12 border-4 border-purple-200 border-b-purple-500 rounded-full animate-spin animation-delay-500"></div> */}

                        {/* Cursor icon in center */}
                        <div className="absolute top-1/2 left-1/2 p-2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 font-semibold text-lg">
                            𝓬𝓾𝓻𝓸24
                        </div>

                    </div>
                </div>

                <p className="text-gray-600 text-center">Please wait while we process your request...</p>

                {/* Progress bar for additional visual feedback */}
                <div className="mt-6 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
            </div>

        </div>
    );
};

export default Loader;