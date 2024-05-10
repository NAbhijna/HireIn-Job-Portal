"use client";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import homeImage from '../assets/Home.png';
import Phone from '../assets/Phones.png';
import Slide from '../components/Slide';
import { db } from '../firebase';
import { orderBy, limit, getDocs, collection, query } from "firebase/firestore";
import JobItem from '../components/JobItem';
import Candidate from '../assets/Candidate.png';
import Employer from '../assets/Employer.png';
import Spinner from '../components/Spinner';
import { useAuthStatus } from '../hooks/useAuthStatus';

const Home = () => {
  const contactUsRef = useRef(null);
  const navigate = useNavigate();

  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedIn, checkingStatus } = useAuthStatus();
  

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const jobs = [];
        querySnapshot.forEach((doc) => {
          jobs.push({ id: doc.id, data: doc.data() });
        });
        setRecentJobs(jobs);
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching recent jobs:", error);
        setIsLoading(false); // Set isLoading to false even if there's an error
      }
    };

    fetchRecentJobs();
  }, []);

  const handleCategoryClick = (category) => {
    navigate('/find-jobs', { state: { category } });
  }

  const handleJobClick = (job) => {
    navigate('/job', { state: { selectedJob: job } });
  };

  const handleGetStarted = () => {
    navigate('/find-jobs');
  };
  
  const handleNavigation = (path) => {
    if (checkingStatus) {
      // Show a spinner or loading indicator while checking the authentication status
      return <Spinner />;
    }
  
    if (loggedIn) {
      // If the user is logged in, navigate to the desired path
      navigate(path);
    } else {
      // If the user is not logged in, redirect to the sign-in page
      navigate('/sign-in');
    }
  };

  return (
    <section className='max-w-[100%] max-h-[100%] relative'>
      {isLoading ? (
      <div className="absolute flex justify-center items-center h-screen">
        <Spinner />
      </div>
    ) : (
      <>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-blue-300 blur-3xl opacity-30 bottom-[85vh] right-[140vh] animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-orange-500 blur-3xl opacity-30 bottom-20 right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-300  blur-3xl opacity-30 top-[13vh] right-40"></div>
      </div>

      <div className="flex justify-center container mt-20 mx-auto px-0 py-8">
        <div className="text-left md:text-left">
          <h1 className="text-4xl  text-transparent font-bold mb-8 mt-10 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text">
            Find your future today!
          </h1>
          <p className="text-white">Where Talent Finds Home</p>
          <p className="text-gray-400">
            <br />
            Welcome to HireIn, where talent meets opportunity.
            <br />
            Explore opportunities from across the globe to learn, <br/>
            showcase skills & get hired by your dream company.
            <br />
            
          </p>
          <button
            onClick={() => handleNavigation('/find-jobs')}
            className=' px-6 py-4 font-bold mt-10  bg-black hover:bg-purple-800 text-white shadow-[0_0_30px_purple] rounded-full w-full md:w-auto'
          >
            Get Started
          </button>
        </div>

        {/* Image*/}
        <div className="flex justify items-center w-[45%] ml-20 mb-20">
          <img
            src={homeImage}
            alt="Website Info Illustration"
            className="w-[70%] h-full mb-4 mt-[-5vh] ml-20 mr-[200px]"
          />
        </div>
      </div>
      <Slide />

      <div className='flex gap-10 w-full justify-center mb-20 mt-60'>
  <div className='flex bg-blue-200 rounded-lg p-8 mr-8 w-[25%] relative'>
    <div className='flex flex-col z-10'>
      <div>
        <h2 className='text-xl font-bold text-white mb-2'>For Employers</h2>
        <p>Find Professionals from around<br/>the world and across all skills</p>
      </div>
      <div className='flex justify-between items-center'>
        <button
          onClick={() => handleNavigation('/upload-job')}
          className="flex items-center justify-center bg-black hover:bg-purple-800 text-white shadow-[0_0_10px_purple] font-bold py-2 px-4 rounded-full w-36 mt-4"
        >
          Upload a Job
        </button>
      </div>
    </div>
    <img
      src={Employer}
      alt='Employer Icon'
      className=' w-[70%] h-[200%] absolute top-[-50%] right-[-27%] z-0'
    />
  </div>
  <div className='flex bg-red-200 rounded-lg p-8 mr-8 w-[25%] ml-10 relative'>
    <div className='flex flex-col z-10'>
      <div>
        <h2 className='text-xl font-bold text-white mb-2'>For Candidates</h2>
        <p>Build your professional Profile <br/>Find new Job Opportunities</p>
      </div>
      <div className='flex justify-between items-center'>
        <button
          onClick={() => handleNavigation('/find-jobs')}
          className="flex items-center justify-center bg-black hover:bg-purple-800 text-white shadow-[0_0_10px_purple] font-bold py-2 px-4 rounded-full w-36 mt-4"
        >
          Find Jobs
        </button>
      </div>
    </div>
    <img
      src={Candidate}
      alt='Candidate Icon'
      className='ml-3 w-[130%] h-[160%] absolute top-[-50%] right-[-42%] z-0'
    />
  </div>
</div>


      <div className="flex items-center mt-60 ">
       <img src={Phone} className="ml-40" />
           <div className="text-3xl text-transparent font-bold mb-8 mt-20 bg-gradient-to-r from-green-200 to-blue-300 bg-clip-text">
             Find Your Dream Job
           </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-4 mt-17">
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-500 shadow-lg shadow-blue-500/50 text-white  font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto">
            Software developer
          </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            System Administrator
          </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            Cybersecurity Analyst
          </button>
        </div>

        
        <div className="flex justify-center mb-20 mt-5 ">
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            Data Scientist
          </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            Web developer
          </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            Database Administrator         </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 text-white shadow-lg shadow-blue-500/50 font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            Help Desk Technician
          </button>
          <button onClick={() => handleCategoryClick('engineering')} className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 text-white shadow-lg shadow-blue-500/50 font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3">
            System Administrator
          </button>
        </div>
      </div>
      
      <div className="flex justify-center text-3xl text-transparent font-bold mb-8 mt-40 bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text">
  Recent Updates
</div>
<div>
  <h2 className="text-2xl font-bold mb-4">Recent Job Postings</h2>
  <ul className="flex flex-wrap justify-center" >
    {recentJobs.map((job) => (
      <JobItem key={job.id} job={job.data} id={job.id}  handleClick={handleJobClick} />
    ))}
  </ul>
</div>


      {/* Contact Us section */}
      <div className="bg-transparent shadow-[0_0_10px_purple] py-12 mt-20 " ref={contactUsRef} id="contact">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-400">Get in touch with us for any inquiries or support.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400">
                Email: <a href="mailto:contact@example.com" className="text-white hover:text-purple-500">contact@hirein.in</a>
              </p>
              
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
    </section>
  );
};

export default Home;