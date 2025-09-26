import React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading,
  ...props
}) => (
  <button
    {...props}
    className={`px-4 py-2 rounded font-semibold transition-colors ${
      variant === "primary"
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : variant === "secondary"
        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
        : "bg-red-600 text-white hover:bg-red-700"
    } ${props.className ?? ""}`}
    disabled={loading || props.disabled}
  >
    {loading ? <span className="loader mr-2" /> : null}
    {children}
  </button>
);
export default Button;