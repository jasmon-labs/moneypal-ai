import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard"); 

    } catch (err: any) {
      setError(err.message || "Cannot reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="logo-section">
            {/* Rebranded to MoneyPal */}
            <h1 className="logo-text">MoneyPal</h1>
            <p className="logo-subtitle">
              Your financial buddy from Manipal. 🏛️
            </p>
          </div>

          {error && <div className="error-message" style={{color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

          <div className="form-group">
            <div className="input-wrapper">
              <Mail className="input-icon" size={22} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="custom-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <Lock className="input-icon" size={22} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="custom-input password-input"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}