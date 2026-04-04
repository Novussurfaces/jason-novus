"use client";

import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";
import { ComponentProps } from "react";

type LinkHref = ComponentProps<typeof Link>["href"];

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: LinkHref;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variants = {
  primary:
    "bg-gradient-to-b from-accent to-accent/90 text-white shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.45)] ring-1 ring-inset ring-white/20",
  secondary:
    "bg-white/[0.06] backdrop-blur-xl text-foreground border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.10]",
  ghost:
    "bg-transparent text-muted hover:text-foreground hover:bg-white/[0.06]",
};

const sizes = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-sm",
  lg: "px-9 py-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]",
    variants[variant],
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
