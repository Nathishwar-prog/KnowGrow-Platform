"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function RedirectButton({ label, href, variant = "primary", icon, onClick, className = "" }) {
    const baseClasses = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 shadow-lg";

    const variantClasses = variant === "primary"
        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
        : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50";

    const sizeClasses = className;

    const iconComponents = {
        arrow: ArrowRight,
        play: Play
    };

    const IconComponent = iconComponents[icon];

    const buttonContent = (
        <>
            {label}
            {IconComponent && <IconComponent className="ml-2 w-5 h-5" />}
        </>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
            >
                {buttonContent}
            </button>
        );
    }

    return (
        <Link
            href={href || "#"}
            className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
        >
            {buttonContent}
        </Link>
    );
}
