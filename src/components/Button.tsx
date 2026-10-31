import React from "react";
import { IconSpinner } from "./Icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger-ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // 2-radius system: 8px for buttons, 12px for cards
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition select-none rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5e4cff] disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-xs gap-2",
      lg: "h-10 px-4 text-sm gap-2",
    }[size];

    const variantStyles = {
      primary:
        "bg-[#5e4cff] hover:bg-[#523ff0] active:scale-[0.98] text-white shadow-xs",
      secondary:
        "bg-white dark:bg-[#1a1d2d] border border-[#cdd2d9] dark:border-[#2e334a] text-[#36394a] dark:text-slate-200 hover:bg-[#f6f8fa] dark:hover:bg-[#25283a] shadow-2xs",
      ghost:
        "bg-transparent text-[#666d80] dark:text-slate-400 hover:text-[#272835] dark:hover:text-white hover:bg-[#eceff3]/60 dark:hover:bg-slate-800/60",
      "danger-ghost":
        "bg-transparent text-[#ef4444] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <IconSpinner className="w-3.5 h-3.5 shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
