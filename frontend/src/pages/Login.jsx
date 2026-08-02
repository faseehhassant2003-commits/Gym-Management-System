import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {

    if (email === "") {
      setError("Please enter your email");
      return;
    }

    if (password === "") {
      setError("Please enter your password");
      return;
    }
    setError("");

    navigate("/dashboard");
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Gym Management Login</h2>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <button
        onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;