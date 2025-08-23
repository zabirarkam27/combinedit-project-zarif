
import { auth, googleProvider } from "../firebase/firebase.config.js";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const adminGmail = import.meta.env.VITE_ADMIN_GMAIL;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  //  Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInEmail = result.user.email;

      if (loggedInEmail === adminGmail) {
        navigate("/dashboard");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You are not authorized to access the dashboard.",
        });
        await auth.signOut(); 
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "Please enter write password",
      });
    }
  };
;

  // Email/Password Login Handler
 const handleEmailPasswordLogin = async (e) => {
   e.preventDefault();
   try {
     const result = await signInWithEmailAndPassword(auth, email, password);
     const loggedInEmail = result.user.email;

     if (loggedInEmail === adminEmail) {
       navigate("/dashboard");
     } else {
       await Swal.fire({
         icon: "error",
         title: "Unauthorized",
         text: "You are not authorized to access the dashboard.",
       });
       await auth.signOut();
     }
   } catch (error) {
     Swal.fire({
       icon: "error",
       title: "Login Failed",
       text: "Please enter write password",
     });
   }
 };

  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-[#06b5d4] to-[#3b82f5] max-w-2xl mx-auto flex my-6 rounded-xl items-center justify-center">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Login</h2>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-[#24a3e3] hover:bg-[#318fe8] text-white font-semibold py-2 px-4 rounded shadow flex items-center justify-center gap-2 transition duration-300 mb-4"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          Login with Google
        </button>

        <div className="my-4 text-gray-500 text-sm">or</div>

        {/* Email/Password Login Form */}
        <form
          onSubmit={handleEmailPasswordLogin}
          className="space-y-4 text-left"
        >
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded pr-10"
            />
            <img
              src={showPassword ? "/eye-closed.png" : "/eye-open.png"}
              alt="Toggle visibility"
              className="w-5 h-5 absolute top-3 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide Password" : "Show Password"}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Login with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
