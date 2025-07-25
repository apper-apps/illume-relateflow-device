import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700",
    danger: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700",
    accent: "bg-gradient-to-r from-pink-100 to-rose-100 text-accent-700"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;