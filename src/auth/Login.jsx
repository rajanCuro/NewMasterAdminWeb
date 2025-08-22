import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import leaf from '../assets/doc.png';
import axiosInstance from './axiosInstance';
import { useAuth } from './AuthContext';

function Login({ onLogin }) {
    const { setToken, setUser, setRole } = useAuth()
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('rajan@curo24.com');
    const [password, setPassword] = useState('raj38232644');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        let timer;
        if (success && countdown !== null) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setSuccess("");   // hide message
                setCountdown(null);
            }
        }
        return () => clearTimeout(timer);
    }, [success, countdown]);

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



    const handleGenerateOtp = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axiosInstance.post("/auth/generateOtp", {
                email: username,   // e.g. "ravi@curo24.com"
                password: password // e.g. "123456"
            }, {
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json"
                }
            });

            console.log("OTP generated:", response.data);
            setSuccess("OTP sent to your email!");
            setCountdown(5);
            setShowOtpSection(true);
        } catch (error) {
            console.log("OTP generation failed:", error);
            setError(error.response?.data?.message || error.message || "Failed to generate OTP");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSignIn = async () => {
  setIsLoading(true);
  setError('');

  try {
    const otpString = otp.join('');
    const response = await axiosInstance.post('/auth/signin', {
      email: username,
      password: password,
      logInOtp: otpString
    });

    console.log("Login successful:", response.data);

    const { message, dto } = response.data;
    const { jwtToken,  user } = dto;
    setSuccess(message);
    setCountdown(2);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem('role', JSON.stringify(user.roles.roleName));
    setUser(user);
    setToken(jwtToken);
    setRole(user.roles.roleName);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

  } catch (error) {
    console.log("Login failed:", error);
    setError(error.response?.data?.message || error.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (showOtpSection) {
            handleSignIn();
        } else {
            handleGenerateOtp();
        }
    };

    const handleResendOtp = () => {
        handleGenerateOtp();
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
                <form onSubmit={handleSubmit} className="w-full max-w-md border px-14 py-8 border-gray-200 shadow rounded-xl ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign in securely</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-1 p-3 mb-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            ✅ {success} 
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="float-container">
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="email"
                                id="email"
                                placeholder=" "
                                className="float-input"
                                required
                                disabled={isLoading || showOtpSection}
                            />
                            <label htmlFor="email" className="float-label">Email Address</label>
                        </div>
                        <div className="float-container relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="float-input pr-10"
                                required
                                disabled={isLoading || showOtpSection}
                            />
                            <label htmlFor="password" className="float-label">Password</label>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={togglePasswordVisibility}
                                disabled={isLoading || showOtpSection}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* OTP Section */}
                        {showOtpSection && (
                            <div className="otp-section space-y-4">
                                <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to your email</p>
                                <div className="flex justify-between space-x-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputsRef.current[index] = el)}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleChange(e.target.value, index)}
                                            onPaste={handlePaste}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="submit-btn w-full flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {showOtpSection ? "Verifying..." : "Sending OTP..."}
                                    </>
                                ) : showOtpSection ? "Verify OTP" : "Send OTP"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;