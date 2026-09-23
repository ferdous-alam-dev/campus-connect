import React, { useState } from "react";

export default function Navbar() {
  // ================================
  // CHECK LOGGED-IN USER
  // ================================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campusUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ================================
  // SIGNUP STATES
  // ================================
  const [showSignup, setShowSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // LOGIN STATES
  // ================================
  const [showLogin, setShowLogin] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  // ================================
  // SIGNUP FUNCTION
  // ================================
  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setMessage(data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        "Backend server se connection nahi ho raha."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOGIN FUNCTION
  // ================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    setLoginMessage("");
    setLoginError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(
          data.message || "Login failed"
        );
        return;
      }

      // SAVE USER
      localStorage.setItem(
        "campusUser",
        JSON.stringify(data.user)
      );

      // UPDATE NAVBAR
      setUser(data.user);

      // CLOSE LOGIN
      setShowLogin(false);

      // CLEAR LOGIN FORM
      setLoginEmail("");
      setLoginPassword("");

    } catch (err) {
      setLoginError(
        "Backend server se connection nahi ho raha."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ================================
  // LOGOUT FUNCTION
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("campusUser");

    setUser(null);
  };

  return (
    <>
      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="navbar">
        <div className="nav-container">

          {/* LOGO */}
          <a href="#" className="logo">
            🎓 Campus<span>Connect</span>
          </a>

          {/* NAV LINKS */}
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#explore">Explore</a>
            <a href="#events">Events</a>
            <a href="#community">Community</a>
            <a href="#about">About</a>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-actions">

            {user ? (
              <>
                {/* USER NAME */}
                <span className="user-welcome">
                  👋 Hi, {user.name}
                </span>

                {/* LOGOUT */}
                <button
                  className="login-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <button
                  className="login-btn"
                  onClick={() => {
                    setShowLogin(true);
                    setShowSignup(false);
                    setLoginMessage("");
                    setLoginError("");
                  }}
                >
                  Login
                </button>

                {/* SIGN UP */}
                <button
                  className="signup-btn"
                  onClick={() => {
                    setShowSignup(true);
                    setShowLogin(false);
                    setMessage("");
                    setError("");
                  }}
                >
                  Sign Up
                </button>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* ================================
          SIGNUP MODAL
      ================================= */}

      {showSignup && (
        <div
          className="auth-overlay"
          onClick={() => setShowSignup(false)}
        >
          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="auth-close"
              onClick={() => setShowSignup(false)}
            >
              ×
            </button>

            <div className="auth-icon">
              🎓
            </div>

            <h2>Create your account</h2>

            <p className="auth-subtitle">
              Join CampusConnect and make campus life easier.
            </p>

            <form onSubmit={handleSignup}>

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={6}
                required
              />

              {error && (
                <p className="auth-error">
                  ❌ {error}
                </p>
              )}

              {message && (
                <p className="auth-success">
                  ✅ {message}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <p className="auth-login-text">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                  setLoginMessage("");
                  setLoginError("");
                }}
              >
                Login
              </button>
            </p>

          </div>
        </div>
      )}

      {/* ================================
          LOGIN MODAL
      ================================= */}

      {showLogin && (
        <div
          className="auth-overlay"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="auth-close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <div className="auth-icon">
              🎓
            </div>

            <h2>Welcome back</h2>

            <p className="auth-subtitle">
              Login to your CampusConnect account.
            </p>

            <form onSubmit={handleLogin}>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              {loginError && (
                <p className="auth-error">
                  ❌ {loginError}
                </p>
              )}

              {loginMessage && (
                <p className="auth-success">
                  ✅ {loginMessage}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

            <p className="auth-login-text">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                  setMessage("");
                  setError("");
                }}
              >
                Sign Up
              </button>
            </p>

          </div>
        </div>
      )}
    </>
  );
}