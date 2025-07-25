import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hoverable = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-100 transition-all duration-200";
  
  const variants = {
    default: "shadow-lg",
    elevated: "shadow-xl",
    flat: "shadow-sm",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg"
  };

  const hoverStyles = hoverable ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;