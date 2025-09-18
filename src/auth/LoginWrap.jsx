import React from 'react';
import bgImage from '../assets/LGBG.png';
import sideImage from '../assets/login.png'; // Make sure to import your side image
import forgtImg from '../assets/forgetImg.png'; // Make sure to import your side image
import forgetSuccess from '../assets/successForget.png'; // Make sure to import your side image
import Login from './Login'
import { useAuth } from './AuthContext';
import ForgetPassword from './ForgetPassword';

function LoginWrap() {
  const { setForgetPassword, forgetPassword, passwordSuccess, setPasswordSuccess } = useAuth()
  // alert(forgetPassword)
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='text-center pt-6 capitalize text-gray-50 font-bold text-2xl'>
        Welcome to Curo24
        Your <span className='underline text-4xl'>24/7</span> digital <span className='uppercase '>healthcare</span> companion
      </div>
      <div className=" flex justify-center gap-4 items-center ">
        {/* Container for left & right */}
        <div className=" rounded-lg  flex w-full overflow-hidden  h-[80vh] mt-10">
          {/*  Login Form */}
          <div className="w-full">
            {forgetPassword ? <ForgetPassword /> : <Login />}
          </div>
          {/*  Image */}
          <div className="w-1/2 hidden md:block mt-10">
            {forgetPassword ? (
              passwordSuccess ? (
                <img
                  src={forgetSuccess}
                  alt="Success"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={forgtImg}
                  alt="Forgot Password"
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <img
                src={sideImage}
                alt="Default"
                className="h-full w-full object-cover"
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginWrap;
