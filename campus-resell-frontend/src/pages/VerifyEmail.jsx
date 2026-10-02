import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import api from "../api/axios";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/verify-email", {
        email,
        otp,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Invalid verification request.</p>
          <button onClick={() => navigate("/register")} className="rounded bg-blue-600 px-4 py-2 text-white">
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleVerify} className="w-full max-w-md rounded-lg border p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">Verify Your Email</h2>

        <p className="mb-6 text-gray-600">
          Enter the 6-digit OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
          className="mb-4 w-full rounded border p-3"
        />

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 px-4 py-3 text-white disabled:opacity-50">
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
