import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function JobItem({ job, handleClick }) {
  return (
    <li className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
      <div className="relative ml-5 bg-gray-300 p rounded-lg hover:scale-105 transition-scale duration-200 ease-in flex flex-col justify-between items-center shadow-md " onClick={() => handleClick(job)}>
        <Link className="contents">
          <img
            className="h-[170px] w-full object-cover rounded-lg "
            loading="lazy"
            src={job.image}
            alt="Job Image"
          />
          <Moment
            className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
            fromNow
          >
            {job.createdAt?.toDate()}
          </Moment>
          <div className="w-full p-[10px]">
            <div className="flex items-center space-x-1">
              <MdLocationOn className="h-4 w-4 text-green-600" />
              <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
                {job.location}
              </p>
            </div>
            <p className="font-semibold m-0 text-xl truncate">{job.jobName}</p>
            <div className="flex items-center mt-[10px] space-x-3">
              <div className="flex items-center space-x-1">
                <p className="font-bold text-xs">{job.jobType}</p>
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-bold text-xs">{job.timings}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}