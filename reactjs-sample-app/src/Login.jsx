import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import Header from "./Header";

const Login = () => {
  const { login, error, clearError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      clearError();
      await login();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <Header title="eGain AI Search" showUserInfo={false} />

      <div className="login-form">
        <div className="login-content">
          <h2>Welcome to eGain AI Search</h2>
          <p>Please authenticate to access the search functionality.</p>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={clearError} className="error-dismiss">
                Dismiss
              </button>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="login-button"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Authenticating..." : "Login with eGain"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
