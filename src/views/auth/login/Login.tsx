import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "../../contexts/ToastContext";
import styles from "./login.module.css";
import { Eye, EyeOff } from "lucide-react";

type LoginCredentials = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  // Mock login function - replace with your actual authentication logic
  const login = async (data: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (data.email === "hr@mhcognition.com" && data.password === "password123") {
      const userData = {
        id: "1",
        role: "hr",
        email: data.email,
        username: "HR Manager"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", "hr");
      setIsLoading(false);
      return true;
    } else if (data.email === "employee@mhcognition.com" && data.password === "password123") {
      const userData = {
        id: "2",
        role: "employee",
        email: data.email,
        username: "Employee User"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", "employee");
      setIsLoading(false);
      return true;
    } else {
      setError("Invalid email or password");
      setIsLoading(false);
      return false;
    }
  };

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data);
    if (success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      showToast("Login successful!", "success");
      
      if (user.role === "hr") {
        navigate("/hr/home", { replace: true });
      } else if (user.role === "employee") {
        navigate("/employee/home", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else if (error) {
      showToast(error, "error");
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