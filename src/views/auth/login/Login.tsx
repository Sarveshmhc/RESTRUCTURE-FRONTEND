import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./login.module.css";
import { Eye, EyeOff } from "lucide-react";

type LoginCredentials = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { showToast } = useToast();
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "hr") {
        navigate("/hr/home", { replace: true });
      } else if (user.role === "employee") {
        navigate("/employee/home", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data);
    if (success) {
      // Get user data from localStorage since AuthContext sets it
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        showToast("Login successful!", "success");

        if (user.role === "hr") {
          navigate("/hr/home", { replace: true });
        } else if (user.role === "employee") {
          navigate("/employee/home", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } else {
      showToast(error || "Login failed", "error");
    }
  };

  return (
    <div className={styles.loginBg}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.loginForm}
      >
        <h2 className={styles.loginTitle}>Sign in to HRM Portal</h2>

        {/* Demo Credentials */}
        <div className={styles.demoBox}>
          <p><strong>Demo Credentials:</strong></p>
          <p>HR: hr@mhcognition.com / password123</p>
          <p>Employee: employee@mhcognition.com / password123</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={styles.input}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className={styles.inputError}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.inputError}>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitBtn}
        >
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              Signing in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        <div className={styles.forgot}>
          <a href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;