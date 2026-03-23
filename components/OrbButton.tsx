// components/OrbButton.tsx
//
// Web recreation of the React Native OrbContinueButton.
// Animated pink gradient base + two floating orb blobs + blur overlay.
// Use for primary CTAs only — secondary buttons should stay flat.

"use client";

import { forwardRef } from "react";

interface OrbButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** Render as a link instead of a button */
  href?: string;
  /** Full width on mobile */
  fullWidthMobile?: boolean;
  /** Size variant */
  size?: "default" | "lg";
}

const OrbButton = forwardRef<HTMLButtonElement, OrbButtonProps>(
  (
    {
      children,
      href,
      fullWidthMobile = false,
      size = "default",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses =
      size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3.5 text-sm";

    const widthClasses = fullWidthMobile ? "w-full sm:w-auto" : "";

    const sharedClasses = `
      orb-button group relative inline-flex items-center justify-center
      ${sizeClasses} ${widthClasses}
      font-bold text-white rounded-full
      overflow-hidden cursor-pointer
      transition-transform duration-200 ease-out
      hover:scale-[1.02] active:scale-[0.97]
      shadow-lg shadow-pink-500/25
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      ${className}
    `.trim();

    const inner = (
      <>
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #ec4899 0%, #db2777 50%, #be185d 100%)",
          }}
        />

        {/* Animated orb blob 1 — warm pink, drifts left-to-right */}
        <div
          className="absolute rounded-full orb-blob-1"
          style={{
            width: 280,
            height: 280,
            top: "-50%",
            left: "-40%",
            background:
              "radial-gradient(circle, rgba(251,146,196,0.5) 0%, rgba(251,146,196,0) 70%)",
          }}
        />

        {/* Animated orb blob 2 — cool pink, drifts right-to-left */}
        <div
          className="absolute rounded-full orb-blob-2"
          style={{
            width: 240,
            height: 240,
            bottom: "-50%",
            right: "-30%",
            background:
              "radial-gradient(circle, rgba(244,114,182,0.45) 0%, rgba(244,114,182,0) 70%)",
          }}
        />

        {/* Blur + lighten overlay — mimics the BlurView from the app */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </>
    );

    if (href && !disabled) {
      return (
        <a href={href} className={sharedClasses}>
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={sharedClasses}
        disabled={disabled}
        {...props}
      >
        {inner}
      </button>
    );
  },
);

OrbButton.displayName = "OrbButton";
export default OrbButton;
