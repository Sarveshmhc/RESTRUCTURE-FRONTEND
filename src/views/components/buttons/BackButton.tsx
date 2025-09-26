import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: "default" | "outline";
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = "Back",
  variant = "default",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
        ${variant === "default"
          ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white"
          : "border border-[var(--color-primary)] text-[var(--color-primary-dark)] bg-white hover:bg-[var(--color-primary-light)]"}
        ${className}`}
      style={{ minWidth: "fit-content" }}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;