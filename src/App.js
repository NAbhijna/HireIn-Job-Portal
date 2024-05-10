import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Job from './pages/Job';
import SignIn from './pages/SignIn';
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import FindJobs from "./pages/FindJobs"; // Import the FindJobs page
import UploadJob from "./pages/UploadJob"; // Import the UploadJob page
import PrivateRoute from "./components/PrivateRoute";
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get the user's account type from Firebase Authentication
        const accountType = user.customClaims?.accountType || user.providerData[0].providerId;
        setUserRole(accountType === 'recruiter' ? 'recruiter' : 'candidate');
      } else {
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/job" element={<Job />} />
        <Route path="/upload-job" element={<PrivateRoute />}>
          <Route path="/upload-job" element={<UploadJob />} />
        </Route>
      </Routes>
    </Router>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
/>
    </>
  );
}

export default App;