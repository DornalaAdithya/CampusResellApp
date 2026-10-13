import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import userAuthStore from "../stores/authStore";

function VerifyLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const verifyLoginOTP = userAuthStore((state) => state.verifyLoginOTP);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyLoginOTP({ email, otp });

      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="p-8 text-center">
        Invalid login verification. Please log in again.
        <button onClick={() => navigate("/login")} className="ml-2 text-blue-600 underline">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleVerify} className="w-full max-w-md rounded-lg border p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">Verify Your Login</h2>

        <p className="mb-4 text-gray-600">
          Enter the OTP sent to <strong>{email}</strong>.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          className="mb-4 w-full rounded border p-3"
        />

        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 px-4 py-3 text-white disabled:opacity-50">
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </form>
    </div>
  );
}

export default VerifyLogin;
