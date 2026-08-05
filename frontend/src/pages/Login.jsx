import api from "../api/api";




import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {

    if (email === "") {
      setError("Please enter your email");
      return;
    }

    if (password === "") {
      setError("Please enter your password");
      return;
    }
    setError("");
   localStorage.removeItem("token");
  try {

    const response = await api.post("/auth/login", {
        username: email,
        password: password
    });

    if (response.data.success) {

        localStorage.setItem("token", response.data.token);

        navigate("/dashboard");

    } else {

        setError(response.data.message);

        localStorage.removeItem("token");

    }

} catch (error) {

    localStorage.removeItem("token");

    if (error.response) {

        setError(
            error.response.data.message ||
            "Invalid username or password"
        );

    } else {

        setError("Unable to connect to server");

    }

}}

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