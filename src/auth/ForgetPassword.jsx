import React, { useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { CgMail } from 'react-icons/cg';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function ForgetPassword() {
    const { setPasswordSuccess, setForgetPassword } = useAuth();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showSuccessSection, setShowSuccessSection] = useState(false);
    const inputsRef = useRef([]);
    const [countdown, setCountdown] = useState(null);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        let timer;
        if (success && countdown !== null) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setSuccess("");
                setCountdown(null);
            }
        }
        return () => clearTimeout(timer);
    }, [success, countdown]);

    useEffect(() => {
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

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

        if (/^\d{6}$/.test(pasteData)) {
            const newOtp = pasteData.split('').slice(0, 6);
            setOtp(newOtp);

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
            // Simulate API call to send OTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowOtpSection(true);
            setSuccess("OTP has been sent to your email");
            setCountdown(5);
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Simulate OTP verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            const otpString = otp.join('');

            if (otpString === "123456") { // Mock valid OTP
                setShowOtpSection(false);
                setShowPasswordSection(true);
                setSuccess("OTP verified successfully");
                setCountdown(3);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (error) {
            setError("Failed to verify OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setIsLoading(true);
        setError("");

        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // Simulate password reset API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setShowPasswordSection(false);
            setShowSuccessSection(true);
            setSuccess("Password reset successfully");
            setPasswordSuccess(true)
            setCountdown(5);
        } catch (error) {
            setError("Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = () => {
        handleGenerateOtp();
    };

    const handleBackToLogin = () => {
        setForgetPassword(false)
        setPasswordSuccess(false)
    };

    const handleBackToEmail = () => {
        setShowOtpSection(false);
        setShowPasswordSection(false);
        setOtp(Array(6).fill(""));
    };

    return (
        <div className="min-h-screen flex items-start justify-center  ">
            <div className="w-full max-w-md bg-white rounded-xl mt-20 shadow-2xl overflow-hidden ">
                <div className="bg-white rounded-lg p-8">
                    {!showSuccessSection && <h1
                        onClick={() => setForgetPassword(false)}
                        className="flex items-center text-[#0cc0df] cursor-pointer hover:underline text-lg font-semibold"
                    >
                        <AiOutlineArrowLeft className="mr-2" size={20} />
                        Back To Login
                    </h1>}
                    {!showSuccessSection && <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                    </div>}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && !showSuccessSection && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm">
                            ✅ {success}
                        </div>
                    )}

                    {!showOtpSection && !showPasswordSection && !showSuccessSection && (
                        <div className="space-y-4">
                            <p className="text-[#0cc0df] text-sm mb-6">
                                Enter your email address and we'll send you an OTP to reset your password.
                            </p>

                            <div className="relative">
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors peer"
                                    placeholder=" "
                                    required
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all 
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                                            peer-focus:bg-white peer-focus:px-1 -top-2 text-sm bg-white px-1"
                                >
                                    Email Address
                                </label>
                            </div>

                            <button
                                onClick={handleGenerateOtp}
                                disabled={isLoading || !username}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : "Send OTP"}
                            </button>
                        </div>
                    )}

                    {showOtpSection && (
                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm mb-6">
                                Enter the 6-digit OTP sent to your email address.
                            </p>

                            <div className="flex justify-between space-x-2 mb-4">
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
                                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Didn't receive the code?</span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-[#0cc0df] font-medium disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otp.some(digit => digit === "")}
                                className="w-full bg-[#0cc0df] hover:bg-[#0cc0df] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    {showPasswordSection && (
                        <div className="space-y-4">
                            <p className='text-gray-500 flex justify-start items-center gap-2'><CgMail className='mt-1' /> {username}</p>
                            <p className="text-gray-600 text-sm mb-2">
                                Please enter your new password.
                            </p>

                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors peer"
                                    placeholder=" "
                                    required
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all 
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                                            peer-focus:bg-white peer-focus:px-1 -top-2 text-sm bg-white px-1"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors peer"
                                    placeholder=" "
                                    required
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all 
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                                            peer-focus:bg-white peer-focus:px-1 -top-2 text-sm bg-white px-1"
                                >
                                    Confirm Password
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {passwordError && (
                                <div className="text-red-500 text-sm">{passwordError}</div>
                            )}

                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                                className="w-full bg-[#0cc0df] hover:bg-[#0cc0df] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </>
                                ) : "Reset Password"}
                            </button>
                        </div>
                    )}

                    {showSuccessSection && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="text-green-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successful</h3>
                            <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
                            <button
                                onClick={handleBackToLogin}
                                className="w-full submit-btn text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;