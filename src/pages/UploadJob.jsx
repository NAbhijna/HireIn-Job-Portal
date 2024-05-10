import React, { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Upload from "../assets/Upload.png";
import JobImage1 from "../assets/job-image-1.png";
import JobImage2 from "../assets/job-image-2.png";
import {toast} from "react-toastify";

const UploadJob = () => {
  const [formData, setFormData] = useState({
    image: null,
    jobName: "",
    apUrl: "",
    applicationDeadline: "",
    eligibility: "",
    jobDescription: "",
    location: "",
    jobType: "",
    compName: "",
    salary: "",
    timings: ""
  });
  const { image, jobName, apUrl, compName, applicationDeadline, eligibility, jobDescription, jobType,salary,location,timings} = formData;
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
  
    // Files
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevState) => ({
        ...prevState,
        image: file,
        imageUrl: imageUrl,
      }));
    }
  
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);

    async function storeImage(image)
    {
      return new Promise((resolve, reject)=>{
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask =  uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await storeImage(image);

    const jobData = {
      image: imgUrls,
      jobName,
      apUrl,
      applicationDeadline,
      eligibility,
      jobDescription,
      location,
      jobType,
      compName,
      salary,
      timings,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "jobs"), jobData);
    setLoading(false);
    toast.success("Job uploaded successfully");
    navigate("/");
  }
  
  return (
    <section className="flex justify-center items-center h-full w-full mt-[5vh] px-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-purple-300 blur-3xl opacity-30 bottom-[45vh] right-[160vh] animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-pink-500 blur-3xl opacity-30 bottom-20 right-20 animate-pulse"></div>
        
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 via-purple-300 blur-3xl opacity-20 bottom-20 right-80"></div>
      </div>

      {/* Left Image */}
      <div className="absolute left-0 top-90">
        <img src={JobImage1} alt="Job Image 1" className="h-80" />
      </div>

      <form className="w-full mb-[5vh] max-w-3xl bg-white/10 backdrop-blur-lg rounded-lg px-8 py-10 mt-10" onSubmit={onSubmit}>
        <h2 className="text-2xl text-white font-bold text-center mb-6">Upload Job</h2>

        <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between gap-2">
            {/* Image upload section (larger square on the right) */}
            <div className="relative overflow-hidden h-32 w-32 mr-4 rounded-lg bg-gray-900 border border-gray-500">
            {formData.imageUrl && (
    <img
      src={formData.imageUrl}
      alt="Uploaded Job Image"
      className="absolute inset-0 object-cover h-full w-full"
    />
  )}
  <label htmlFor="image" className="absolute inset-0 cursor-pointer flex items-center justify-center top-0 left-0 bg-transparent hover:bg-gray-200 opacity-0 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
    {!formData.imageUrl ? (
      <span className="text-black text-center">Upload Image</span>
    ) : null}
  </label>
  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    onChange={onChange}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
            </div>

            {/* Job Name input */}
            <div className=" ml-5 mt-6 items-center">
              <label htmlFor="jobName" className="mr-60 text-gray-300 block w-[40%]">Job Name:</label>
              <input type="text" id="jobName" value={jobName} onChange={onChange} placeholder="Enter Job Name" className="w-[80%] px-3 py-2 rounded-md border bg-transparent text-white border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
            <div className="mt-6 items-center">
            <label htmlFor="compName" className="mr-4 text-gray-300 block w-[40%]">Company:</label>
              <input type="text" id="compName" value={compName} onChange={onChange} placeholder="Company" className="w-full px-3 py-2 rounded-md border bg-transparent text-white border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
            
          </div>
          <div className="flex ml-40 justify-between items-center">
              <label htmlFor="apUrl" className="mr-0 ml-2 text-gray-300 block w-[40%]">Application URL:</label>
              <input type="text" id="apUrl" value={apUrl}onChange={onChange} placeholder="Application URL" className="w-full px-3 py-2 rounded-md border bg-transparent text-white border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="flex items-center">
          <label htmlFor="eligibility" className="mr-4 text-gray-300 block w-full">Job Eligibility:</label>
<select
  id="eligibility"
  value={eligibility} // Assuming you have a state variable 'eligibility' to store the selected value
  onChange={onChange} // Assuming you have an onChange handler to update the state
  className="w-full px-3 py-2 rounded-md text-white border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500"
  required
>
  <option value="" className="bg-black">Select Eligibility</option>
  {/* Add your eligibility options here */}
  <option value="Professionals" className="bg-black">Professionals</option>
  <option value="College Students" className="bg-black">College Students</option>
  {/* Add more options as needed */}
</select>

            </div>
            <div className="flex items-center">
              <label htmlFor="applicationDeadline" className="mr-4 text-gray-300 block w-full">Application Deadline:</label>
              <input type="date" id="applicationDeadline" value={applicationDeadline} onChange={onChange} placeholder="Enter Deadline" className="w-full text-gray-500 bg-transparent px-3 py-2 rounded-md border border-gray-300  focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
            
          </div>

          {/* Job Description (separate row) */}
          <div className="mt-4 mb-4">
            <label htmlFor="jobDescription" className="text-gray-300 block mb-2">Job Description:</label>
            <textarea id="jobDescription" value={jobDescription} onChange={onChange} rows={5} placeholder="Enter detailed job description" className="w-full px-3 py-2 rounded-md border text-white bg-transparent border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500" required></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
              <label htmlFor="location" className="mr-4 text-gray-300 block">Location:</label>
              <input type="text" id="location" value={location} onChange={onChange} placeholder="Location" className="w-full px-3 py-2 rounded-md text-white border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
            <div className=" ml-5 flex items-center ">
            <label htmlFor="jobType" className="mr-4 text-gray-300 block w-full">Job Type:</label>
<select
  id="jobType"
  value={jobType}
  onChange={onChange}
  className="w-full ml-[-10vh] px-3 py-2 rounded-md text-white border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500"
  required
>
  <option value="" className="bg-black">Select Job Type</option>
  <option value="In Office" className="bg-black">In Office</option>
  <option value="Work from Home" className="bg-black">Work from Home</option>
  <option value="Hybrid" className="bg-black">Hybrid</option>
</select>

            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
              <label htmlFor="salary" className="mr-4 text-gray-300 block">Salary:</label>
              <input type="text" id="salary" value={salary} onChange={onChange} placeholder="Salary" className="w-full px-3 py-2 rounded-md text-white border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500" required />
            </div>
            <div className="ml-5 flex items-center">
            <label htmlFor="timings" className="mr-4 text-gray-300 block w-full">Timings:</label>
<select
  id="timings"
  value={timings}
  onChange={onChange}
  className="w-full ml-[-10vh] px-3 py-2 rounded-md text-white border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500"
  required
>
  <option value="" className="bg-black">Select Timings</option>
  <option value="Full Time" className="bg-black">Full Time</option>
  <option value="Part Time" className="bg-black">Part Time</option>
  <option value="Flex Time" className="bg-black">Flex Time</option>
</select>

            </div>
          </div>
        </div>
        
        <button type="submit" className=" w-full bg-purple-700 hover:bg-purple-300 text-white  font-bold py-2 rounded-md mt-8 ">
          Upload Job
        </button>
      </form>

      {/* Right Image */}
      <div className="absolute right-10 bottom-20">
        <img src={JobImage2} alt="Job Image 2" className="h-64" />
      </div>
    </section>
  );
};

export default UploadJob;