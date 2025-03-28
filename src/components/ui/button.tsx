import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "danger" | "success";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-accent-blue text-white hover:bg-accent-blue/90 focus-visible:ring-accent-blue",
      outline: "border border-border hover:bg-background/80 hover:text-primary focus-visible:ring-accent-blue",
      ghost: "hover:bg-background/80 hover:text-primary focus-visible:ring-accent-blue",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-accent-blue",
      danger: "bg-accent-coral text-white hover:bg-accent-coral/90 focus-visible:ring-accent-coral",
      success: "bg-accent-green text-white hover:bg-accent-green/90 focus-visible:ring-accent-green"
    };
    
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md"
    };
    
    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 