"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "15s" }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* 3D 404 Text */}
        <div
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          }}
          className="mb-8 transition-transform duration-100"
        >
          <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-black leading-none select-none">
            <span className="bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl relative">
              4
            </span>
            <span
              className="inline-block text-white/10 animate-spin"
              style={{ animationDuration: "4s" }}
            >
              0
            </span>
            <span className="bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
              4
            </span>
          </h1>
        </div>

        {/* Glitch effect text */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Oops! Page{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Not Found
            </span>
          </h2>
        </div>

        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
          to another dimension.
        </p>

        {/* Animated rocket */}
        <div className="flex justify-center mb-8 animate-bounce">
          <Rocket className="w-16 h-16 text-orange-500" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <button className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </button>
          </Link>

          <Link href="/startup">
            <button className="px-8 py-4 rounded-full font-bold text-white border-2 border-slate-600 hover:border-orange-500/50 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              View Startups
            </button>
          </Link>
        </div>

        {/* Animated line */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
        </div>

        {/* IISF branding */}
        <p className="mt-8 text-slate-500 text-sm">IISF • KNIT Sultanpur</p>
      </div>
    </div>
  );
}
