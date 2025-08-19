import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import leaf from '../assets/doc.png'

function Login({ onLogin }) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showPassword, setShowPassword] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (value, index) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < otp.length - 1) inputsRef.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();

        // Only proceed if pasted data is exactly 6 digits
        if (/^\d{6}$/.test(pasteData)) {
            const newOtp = pasteData.split('').slice(0, 6);
            setOtp(newOtp);

            // Focus on the last input field after paste
            if (inputsRef.current[5]) {
                inputsRef.current[5].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleLogin = () => {
        onLogin(); // Set login true in App.js
        navigate("/dashboard"); // Redirect to dashboard
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row body">
            {/* Left Side - Animation/Illustration */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-8">
                <div className="text-white text-center max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Curo24</h1>
                    <p className="text-xl mb-8">Your 24/7 digital healthcare companion</p>
                    {/* SVG kept as in original */}
                    <div className="relative h-64">
                        <div className="relative h-64">
                            <svg className="w-full h-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100,300 L150,250 L200,300 L250,250 L300,300 L350,250 L400,300"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="3"
                                >
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        values="0;100;0"
                                        dur="4s"
                                        repeatCount="indefinite"
                                    />
                                </path>

                                <rect
                                    x="225" y="175"
                                    width="50" height="150"
                                    rx="3"
                                    fill="rgba(255,255,255,0.15)"
                                    stroke="white"
                                    strokeWidth="2"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="translate"
                                        values="0 0; 0 -5; 0 0"
                                        dur="3s"
                                        repeatCount="indefinite"
                                    />
                                </rect>
                                <rect
                                    x="175" y="225"
                                    width="150" height="50"
                                    rx="3"
                                    fill="rgba(255,255,255,0.15)"
                                    stroke="white"
                                    strokeWidth="2"
                                />

                                <g transform="rotate(0 250 250)">
                                    <circle cx="380" cy="250" r="15" fill="white" opacity="0.7">
                                        <animateMotion
                                            path="M0,0a130,130 0 1,1 0,1z"
                                            dur="8s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <text x="380" y="250" textAnchor="middle" fontSize="20" fill="white">❤️</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm opacity-80 mt-8">
                        HIPAA-compliant platform connecting you to healthcare professionals 24/7
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                        Secure patient portal | Instant telehealth | AI symptom checker
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
                <div className='absolute -top-5 -left-4 -md:top-5 md:left-10 z-100'>
                    <img
                        src={leaf}
                        alt=""
                        className="h-58 w-40 rotate-45 opacity-70 "
                    />
                </div>
                <div className="w-full max-w-md border px-14 py-8 border-gray-200 shadow rounded-xl ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign in securely</h2>
                    <div className="space-y-6">
                        <div className="float-container">
                            <input type="email" id="email" placeholder=" " className="float-input" required />
                            <label htmlFor="email" className="float-label">Email Address</label>
                        </div>
                        <div className="float-container relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                className="float-input pr-10"
                                required
                            />
                            <label htmlFor="password" className="float-label">Password</label>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                            <div className="flex justify-between space-x-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">We've sent a 6-digit code to your email</p>
                        </div>
                        <div className="pt-4">
                            <button onClick={handleLogin} className="submit-btn w-full">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;