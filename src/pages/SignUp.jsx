import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import SignUpImg from '../assets/SignUp.png';
import { toast } from 'react-toastify';
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const { fullName, email, password, confirmPassword, phoneNumber } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setUserRole(type === "recruiter" ? "Recruiter" : "Candidate");
  };

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true); // Set isLoading to true before executing the sign-up logic
  
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
  
      const formDataCopy = {
        fullName,
        email,
        phoneNumber,
        userRole,
        timestamp: serverTimestamp(),
      };
  
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("Signed In Successfully")
    } catch (error) {
      toast.error("Something went wrong with the registration");
      console.error(error);
    } finally {
      setIsLoading(false); // Set isLoading to false after the sign-up process is complete or if an error occurs
    }
  }

  return (
    <section className="absolute flex justify-center items-center mt-[7vh] ml-60 ">
      {/* Image container (unchanged) */}
      <div className='mr-40 h-full w-full text-3xl  text-transparent font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text'>Create a new account
      <div className=" whitespace-nowrap text-sm sm:text-lg mb-1">
            <p className=" left-4 text-sm bg-gradient-to-r from-purple-500 to-purple-500 bg-clip-text">
              <br/>Have an account?
            <Link to="/sign-in" className="text-purple-300 hover:text-purple-200 transition duration-200 ease-in-out ml-1 mr-8">Log In
            </Link>
            </p> </div>
            <img src={SignUpImg} alt="Sign Up" />
            {/*<p>
              <Link to="/forgot-password"className=" text-blue-700 hover:text-blue-800
               transition duration-200 ease-in-out ml-3 text-sm">Forgot password?</Link>
            </p>*/}
         </div>

      {/* Form container */}
      <div className='mr-40 w-full'>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500 blur-3xl opacity-30 bottom-90 right-80 "></div>
          <div className="absolute w-72 h-72 rounded-full bg-purple-500 blur-3xl opacity-30 bottom-10 right-20 "></div>
          <div className="absolute w-96 h-96 rounded-full bg-purple-900 blur-3xl opacity-40 top-80 left-80 "></div>
        </div>
        <form onSubmit={onSubmit} className="bg-white/10 backdrop-blur-lg rounded-lg shadow-md px-8 pt-6 pb-8 mb-4 mr-50">
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded-full w-full center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="email@abc.com"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={password}
                onChange={onChange}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="******"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="tel"
              placeholder="+01 12345678"
              value={phoneNumber}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
  <label className="block text-gray-500 text-sm font-bold mb-2">Choose Account Type</label>
  <div className="flex justify-center gap-4">
    <button
      type="button"
      onClick={() => handleAccountTypeChange("recruiter")}
      className={`py-2 px-4 rounded-full transition-colors duration-300 ${
        accountType === "recruiter"
          ? "bg-purple-500 text-white"
          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
      }`}
    >
      Recruiter
    </button>
    <button
      type="button"
      onClick={() => handleAccountTypeChange("candidate")}
      className={`py-2 px-4 rounded-full transition-colors duration-300 ${
        accountType === "candidate"
          ? "bg-purple-500 text-white"
          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
      }`}
    >
      Candidate
    </button>
  </div>
</div>
          <div className="flex gap-4 justify-center">
            <button
              className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
            <p className="text-white mt-2">OR</p>
            <OAuth />
          </div>
          
        </form>
      </div>
      {isLoading && <Spinner />}
    </section>
  );
}