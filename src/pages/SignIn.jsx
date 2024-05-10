import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoginImg from '../assets/SignUp.png';
import OAuth from '../components/OAuth';
import Spinner from "../components/Spinner";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the user's profile from Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate('/profile', { state: { userProfile: docSnap.data() } });
      } else {
        toast.error('User profile not found');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      console.error(error);
    }
    finally {
      setIsLoading(false); // Set isLoading to false after the sign-up process is complete or if an error occurs
    }
  }
 
  return (
    <section className="absolute flex justify-center items-center mt-[7vh] ml-60">
      {/* Image container */}
      <div className="mr-40 h-full w-full text-3xl text-transparent font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
        Log In to your account
        <div className=" whitespace-nowrap text-sm sm:text-lg mb-1">
          <p className=" left-4 text-sm bg-gradient-to-r from-purple-500 to-purple-500 bg-clip-text">
            <br />
            Don't have an account?
            <Link to="/sign-up" className="text-purple-300 hover:text-purple-200 transition duration-200 ease-in-out ml-1 mr-8">
              Sign Up
            </Link>
          </p>
        </div>
        <img src={LoginImg} alt="Login" />
      </div>

      {/* Form container */}
      <div className="mr-40 w-full">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500 blur-3xl opacity-30 bottom-90 right-80"></div>
          <div className="absolute w-72 h-72 rounded-full bg-purple-500 blur-3xl opacity-30 bottom-10 right-20"></div>
          <div className="absolute w-96 h-96 rounded-full bg-purple-900 blur-3xl opacity-40 top-80 left-80"></div>
        </div>
        <form onSubmit={onSubmit} className="bg-white/10 backdrop-blur-lg rounded-lg shadow-md px-8 pt-6 pb-8 mb-4 mr-50">
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
                type={showPassword ? 'text' : 'password'}
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
          <div className="flex gap-4 justify-center">
            <button
              className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
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