
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
    <div className="bg-gradient-to-b from-[#ff8d13]/65 to-[#fc4706]/65 py-6 min-h-screen">
      <div className="min-h-[calc(100vh-48px)]  bg-gradient-to-b from-[#ff8d13] to-[#fc4706] max-w-2xl mx-auto flex rounded-xl items-center justify-center">
        <div className="bg-white/20 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Admin Login</h2>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn text-center text-white font-semibold px-4 py-3 rounded-t-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right w-full"
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
            Login with Google
          </button>

          <div className="my-4 text-white text-sm font-semibold">or</div>

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
              className="w-full border placeholder:text-white border-gray-300 px-4 py-2 rounded"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border placeholder:text-white border-gray-300 px-4 py-2 rounded pr-10"
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
              className="btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right w-full"
            >
              Login with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
