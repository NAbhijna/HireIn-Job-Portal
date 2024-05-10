import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdLocationOn } from "react-icons/md";

const Job = () => {
  const location = useLocation();
  const selectedJob = location.state?.selectedJob;

  if (!selectedJob) {
    return <div>No job selected</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-transaprent text-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-blue-300 blur-3xl opacity-30 bottom-[65vh] right-[160vh] animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-orange-500 blur-3xl opacity-30 bottom-20 right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-300  blur-3xl opacity-30 top-[13vh] right-40"></div>
      </div>
      <div className="bg-transparent p-8 rounded-lg shadow-lg max-w-8xl">
        <div className="flex items-center mb-4">
          <img
            src={selectedJob.image}
            alt={selectedJob.jobName}
            className="w-32 h-32 bg-white rounded-full mr-6"
          />
          <div>
            <h3 className="text-2xl font-bold mb-2">{selectedJob.jobName}</h3>
            <p className="flex gap-2 text-gray-400"><HiOutlineBuildingOffice2 /> {selectedJob.compName}</p>
            <p className="flex gap-2 text-gray-400"><MdLocationOn className="h-4 w-4 text-green-600" />{selectedJob.location}</p>
          </div>
        </div>
        <div className="mb-4">
          <span className="bg-green-300 text-white px-2 py-1 rounded-full mr-2">
            {selectedJob.jobType}
          </span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
            {selectedJob.timings}
          </span>
        </div>
        <p className="text-gray-300 mb-4">
          Eligibility: {selectedJob.eligibility}
        </p>
        <p className="text-gray-300 mb-4">
          Application Deadline: {selectedJob.applicationDeadline}
        </p>
        <p className="text-gray-300 mb-4">Salary: {selectedJob.salary}</p>
        <p className="text-gray-300 mb-4">
          Job Description:
        </p>
        <p className="text-gray-300 mb-4">
          {selectedJob.jobDescription}
        </p>
        <a
          href={selectedJob.apUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-700 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-md"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default Job;