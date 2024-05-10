import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from '../components/Spinner';

export default function FindJobs() {
  const [jobType, setJobType] = useState([]);
  const [timings, setTimings] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleJobTypeChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setJobType([...jobType, value]);
    } else {
      setJobType(jobType.filter(item => item !== value));
    }
  };

  const handleTimingsChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setTimings([...timings, value]);
    } else {
      setTimings(timings.filter(item => item !== value));
    }
  };

  const handleEligibilityChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setEligibility([...eligibility, value]);
    } else {
      setEligibility(eligibility.filter(item => item !== value));
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsCol = collection(db, 'jobs');
      const jobsSnapshot = await getDocs(jobsCol);
      const jobsList = jobsSnapshot.docs.map(doc => doc.data());
      setJobs(jobsList);
      setFilteredJobs(jobsList);
      setIsLoading(false);
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      let filteredJobs = [...jobs];

      if (jobType.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
          const jobTypeValue = job.jobType ? job.jobType.toLowerCase() : '';
          return jobType.some(type => jobTypeValue.includes(type.toLowerCase()));
        });
      }

      if (timings.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
          const timingsValue = job.timings ? job.timings.toLowerCase() : '';
          return timings.some(timing => timingsValue.includes(timing.toLowerCase()));
        });
      }

      if (eligibility.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
          const eligibilityValue = job.eligibility ? job.eligibility.toLowerCase() : '';
          return eligibility.some(elig => eligibilityValue.includes(elig.toLowerCase()));
        });
      }

      setFilteredJobs(filteredJobs);
    }

    filterJobs();
  }, [jobType, timings, eligibility, jobs]);

  const handleJobClick = (job) => {
    navigate('/job', { state: { selectedJob: job } });
  };

  return (
    
    <div className=" max-w-[80%] mx-auto p-6 items-center ">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-blue-300 blur-3xl opacity-30 bottom-[90vhvh] right-[160vh] animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-purple-500 blur-3xl opacity-30 bottom-20 right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-300  blur-3xl opacity-30 top-[13vh] right-40"></div>
      </div>

      {isLoading ? (
        <div className="absolute flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-row ml-2 w-full gap-20">
          {/* Filtering Options */}
          <div className="w-1/4">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-4 shadow-[0_0_10px_purple]">
              <h3 className="text-lg font-bold text-white mb-4">Job Type</h3>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="inOffice"
                    value="In Office"
                    onChange={handleJobTypeChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="inOffice" className="text-white">
                    In Office
                  </label>
                </div>
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="workFromHome"
                    value="Work from Home"
                    onChange={handleJobTypeChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="workFromHome" className="text-white">
                    Work from Home
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hybrid"
                    value="Hybrid"
                    onChange={handleJobTypeChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="hybrid" className="text-white">
                    Hybrid
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-6 mb-4 shadow-[0_0_10px_purple]">
              <h3 className="text-lg font-bold text-white mb-4">Timings</h3>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="fullTime"
                    value="Full Time"
                    onChange={handleTimingsChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="fullTime" className="text-white">
                    Full Time
                  </label>
                </div>
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="partTime"
                    value="Part Time"
                    onChange={handleTimingsChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="partTime" className="text-white">
                    Part Time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="flexTime"
                    value="Flex Time"
                    onChange={handleTimingsChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="flexTime" className="text-white">
                    Flex Time
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-6 shadow-[0_0_10px_purple]">
              <h3 className="text-lg font-bold text-white mb-4">Eligibility</h3>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="professionals"
                    value="Professionals"
                    onChange={handleEligibilityChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="professionals" className="text-white">
                    Professionals
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collegeStudents"
                    value="College Students"
                    onChange={handleEligibilityChange}
                    className="mr-2 rounded-full"
                  />
                  <label htmlFor="collegeStudents" className="text-white">
                    College Students
                  </label>
                </div>
              </div></div>
          </div>

          {/* Job Listings */}
          <div className="flex flex-col w-3/4 overflow-y-auto">
            {filteredJobs.map((job, index) => (
              <div
                key={`${index}-${job.jobName}`}
                onClick={() => handleJobClick(job)}
                className="bg-white/20 flex flex-row rounded-lg p-6 mb-8 shadow-[0_0_10px_purple] w-full max-w-3xl cursor-pointer"
              >
                <div className="mr-6">
                  <img src={job.image} alt={`Job ${index}`} className="w-32 bg-white h-32 rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2"> {job.jobName} </h3>
                  <p className="text-gray-400 mb-2">{job.compName}</p>
                  <p className="text-gray-400 mb-4">{job.location}</p>
                  <div className="flex items-center mb-2">
                    <span className="bg-green-300 text-white px-2 py-1 rounded-full mr-2"> {job.jobType} </span>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full"> {job.timings} </span>
                  </div>
                  <p className="mt-3 text-gray-300 leading-tight"> Eligibility: {job.eligibility} </p>
                  <p className="mt-3 text-gray-300 leading-tight"> Application Deadline: {job.applicationDeadline} </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}