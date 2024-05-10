import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: user.displayName, // Use user.displayName to fetch the user's name
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
  
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }

      
  return (
           <button
              className="flex bg-purple-700 items-center rounded-full hover:bg-purple-900 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onGoogleClick}
              
            >
             <FcGoogle className="  bg-white rounded-full mr-2" /> Sign in with google
            </button>
    
  );
}
