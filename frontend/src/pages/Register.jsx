import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css";

function RegisterMember() {

  const navigate = useNavigate();

  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // OTP countdown
  const [countdown, setCountdown] = useState(30);

  // Store registration information until OTP verification
  const [registrationData, setRegistrationData] = useState(null);


  /*
   * Countdown timer
   */
  useEffect(() => {

    if (!showOtpModal || countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {

      setCountdown((previous) => {

        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [showOtpModal, countdown]);


  /*
   * Send OTP
   */
  async function handleRegister(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation

    if (name.trim() === "") {
      setError("Please enter your full name.");
      return;
    }

    if (email.trim() === "") {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    try {

      setLoading(true);

      /*
       * IMPORTANT:
       * We DO NOT call /auth/register here.
       *
       * We only send the OTP.
       */

      await api.post("/auth/send-otp", {

        name: name,
        email: email,
        phone: phone,
        password: password

      });


      /*
       * Store the registration information.
       * The account will only be created after
       * successful OTP verification.
       */

      setRegistrationData({

        name: name,
        email: email,
        phone: phone,
        password: password

      });


      // Clear previous OTP
      setOtp("");

      // Start countdown
      setCountdown(30);

      // Open OTP popup
      setShowOtpModal(true);

      setSuccess("OTP sent successfully.");

    } catch (error) {

      console.error("Send OTP error:", error);

      if (error.response) {

        setError(
          error.response.data?.message ||
          error.response.data ||
          "Unable to send OTP. "+
          "may be email is already registered."
        );

      } else {

        setError("Unable to connect to server.");

      }

    } finally {

      setLoading(false);

    }
  }
    /*
   * Verify OTP
   */
  async function verifyOtp() {

    setError("");
    setSuccess("");

    if (!otp.trim()) {

      setError("Please enter the OTP.");

      return;
    }

    if (!/^\d{6}$/.test(otp)) {

      setError("OTP must contain exactly 6 digits.");

      return;
    }

    if (!registrationData) {

      setError("Registration information is missing.");

      return;
    }


    try {

      setVerifying(true);

      /*
       * Send registration details + OTP
       *
       * Backend:
       * POST /auth/verify-otp
       */

      const response = await api.post(
        "/auth/verify-otp",
        {

          name: registrationData.name,

          email: registrationData.email,

          phone: registrationData.phone,

          password: registrationData.password,

          otp: otp

        }
      );


      if (response.data.success) {

        setShowOtpModal(false);

        setOtp("");

        setSuccess(
          "Registration successful! Redirecting to login..."
        );


        /*
         * Redirect to login after 1.5 seconds
         */

        setTimeout(() => {

          navigate("/login");

        }, 1500);


      } else {

        setError(
          response.data.message ||
          "Invalid or expired OTP."
        );

      }

    } catch (error) {

      console.error("OTP verification error:", error);

      if (error.response) {

        setError(
          error.response.data?.message ||
          error.response.data ||
          "Invalid or expired OTP."
        );

      } else {

        setError("Unable to connect to server.");

      }

    } finally {

      setVerifying(false);

    }
  }


  /*
   * Resend OTP
   */
  async function resendOtp() {

    if (countdown > 0) {

      return;
    }

    if (!registrationData) {

      setError("Registration information is missing.");

      return;
    }


    try {

      setError("");

      setSuccess("");

      setLoading(true);


      await api.post(
        "/auth/send-otp",
        registrationData
      );


      setOtp("");

      setCountdown(30);

      setSuccess("A new OTP has been sent to your email.");

    } catch (error) {

      console.error("Resend OTP error:", error);

      if (error.response) {

        setError(
          error.response.data?.message ||
          error.response.data ||
          "Unable to resend OTP."
        );

      } else {

        setError("Unable to connect to server.");

      }

    } finally {

      setLoading(false);

    }
  }


  /*
   * Close OTP modal
   */
  function closeOtpModal() {

    if (verifying) {

      return;
    }

    setShowOtpModal(false);

    setOtp("");

    setError("");

    setSuccess("");

  }


  /*
   * Handle OTP input
   */
  function handleOtpChange(e) {

    const value = e.target.value;

    /*
     * Allow only numbers
     * Maximum 6 digits
     */

    if (/^\d{0,6}$/.test(value)) {

      setOtp(value);

    }
  }  return (

    <div className="login-page">

      <div className="login-shell">


        {/* LEFT SIDE */}

        <div className="login-hero">

          <div className="login-badge">
            New Member • Join the Club
          </div>

          <h1 className="login-title">
            Create your gym profile in minutes
          </h1>

          <p className="login-description">
            Sign up to manage memberships, track attendance,
            and stay connected with your fitness journey.
          </p>


          <div className="register-benefits">

            <div className="register-benefit">
              ✓ Quick onboarding
            </div>

            <div className="register-benefit">
              ✓ Secure account setup
            </div>

            <div className="register-benefit">
              ✓ Email verification
            </div>

          </div>

        </div>


        {/* REGISTRATION CARD */}

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              💪
            </div>

            <h2 className="login-card-title">
              Create Member Account
            </h2>

            <p className="login-card-subtitle">
              Start your fitness journey today
            </p>

          </div>


          <form onSubmit={handleRegister}>


            {/* NAME */}

            <div className="login-form-group">

              <label className="login-label">
                Full name
              </label>

              <input
                type="text"
                className="form-control login-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>


            {/* EMAIL */}

            <div className="login-form-group">

              <label className="login-label">
                Email
              </label>

              <input
                type="email"
                className="form-control login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>


            {/* PHONE */}

            <div className="login-form-group">

              <label className="login-label">
                Phone
              </label>

              <input
                type="tel"
                className="form-control login-input"
                placeholder="Enter your 10 digit phone number"
                value={phone}
                onChange={(e) => {

                  const value = e.target.value;

                  if (/^\d{0,10}$/.test(value)) {

                    setPhone(value);

                  }

                }}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-form-group">

              <label className="login-label">
                Password
              </label>

              <input
                type="password"
                className="form-control login-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="login-form-group">

              <label className="login-label">
                Confirm password
              </label>

              <input
                type="password"
                className="form-control login-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

            </div>


            {/* ERROR */}

            {error && (

              <div className="alert alert-danger login-error">

                {error}

              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="alert alert-success login-error">

                {success}

              </div>

            )}


            {/* CREATE ACCOUNT BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

             {loading
                ? "Sending OTP..."
                : "Send OTP"
            }

            </button>

          </form>


          {/* LOGIN LINK */}

          <div className="register-footer">

            Already have an account?

            <Link
              to="/login"
              className="register-link"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* OTP MODAL */}
      {/* ================================================= */}

      {showOtpModal && (

        <div
          className="otp-overlay"
          onClick={closeOtpModal}
        >

          <div
            className="otp-modal"
            onClick={(e) => e.stopPropagation()}
          >


            {/* OTP HEADER */}

            <div className="otp-header">

              <div className="otp-icon">
                📧
              </div>

              <h2>
                Verify Your Email
              </h2>

              <p>
                We've sent a 6-digit OTP to
              </p>

              <strong>
                {registrationData?.email}
              </strong>

            </div>


            {/* OTP INPUT */}

            <div className="otp-form-group">

              <label>
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                className="otp-input"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                autoFocus
              />

            </div>


            {/* ERROR INSIDE MODAL */}

            {error && (

              <div className="alert alert-danger">

                {error}

              </div>

            )}


            {/* VERIFY BUTTON */}

            <button
              type="button"
              className="login-button"
              onClick={verifyOtp}
              disabled={verifying || otp.length !== 6}
            >

              {verifying
                ? "Verifying..."
                : "Verify OTP"
              }

            </button>


            {/* RESEND */}

            <div className="otp-resend">

              {countdown > 0 ? (

                <p>
                  Didn't receive the OTP?
                  <br />
                  Resend available in{" "}
                  <strong>
                    {countdown}s
                  </strong>
                </p>

              ) : (

                <button
                  type="button"
                  className="resend-button"
                  onClick={resendOtp}
                  disabled={loading}
                >

                  {loading
                    ? "Sending..."
                    : "Resend OTP"
                  }

                </button>

              )}

            </div>


            {/* CLOSE */}

            <button
              type="button"
              className="otp-close"
              onClick={closeOtpModal}
              disabled={verifying}
            >

              Cancel

            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default RegisterMember;