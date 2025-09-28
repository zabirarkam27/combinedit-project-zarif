import { auth, googleProvider } from "../firebase/firebase.config.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
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

  // Helper function to mask email for hint
  const getEmailHint = (fullEmail) => {
    if (!fullEmail || !fullEmail.includes("@")) return "";
    const [name, domain] = fullEmail.split("@");
    const maskedName =
      name.length > 2
        ? name[0] + "*".repeat(name.length - 2) + name[name.length - 1]
        : name[0] + "*";
    const maskedDomain =
      domain.length > 4
        ? domain[0] + "*".repeat(domain.length - 4) + domain.slice(-3)
        : domain;
    return `${maskedName}@${maskedDomain}`;
  };

  // Google Login Handler
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
        text: "Something went wrong. Try again!",
      });
    }
  };

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
        text: "Invalid email or password.",
      });
    }
  };

  // Forget Password Handler
  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Enter Email",
        text: "Please enter your registered email first.",
      });
      return;
    }

    // Allow reset only for admin email
    if (email !== adminEmail) {
      Swal.fire({
        icon: "error",
        title: "Not Allowed",
        text: "Your email is not authorized for password reset. If you are the admin, please use the registered admin email. Your registered email maybe: " + getEmailHint(adminEmail),
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: `Password reset email sent to ${getEmailHint(
          email
        )}. Please check your inbox.`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send password reset email. Try again.",
      });
    }
  };

  return (
    <div className="bg-[#a8e2dd] py-6 min-h-screen">
      <div className="min-h-[calc(100vh-48px)] max-w-2xl mx-auto flex rounded-xl items-center justify-center">
        <div className="bg-white/20 p-8 md:p-10 rounded-xl shadow-2xl max-w-sm w-11/12 text-center">
          <h2 className="text-3xl font-bold mb-6">Admin Login</h2>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn text-center text-white font-semibold px-4 py-3 rounded-t-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right w-full flex items-center justify-center gap-2"
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
            Login with Google
          </button>

          <div className="my-4 text-sm font-semibold">or</div>

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
              className="w-full bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 border border-[#398881] rounded-md placeholder:text-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 border border-[#398881] rounded-md placeholder:text-sm"
              />
              <img
                src={showPassword ? "/eye-closed.png" : "/eye-open.png"}
                alt="Toggle visibility"
                className="w-5 h-5 absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              />
            </div>

            {/* Forget Password */}
            <p
              className="text-sm cursor-pointer underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </p>

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
