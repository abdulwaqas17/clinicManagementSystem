// app/not-found.jsx

'use client';
import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 max-w-md">
        Sorry, the page you are looking for doesn’t exist or you don’t have permission to access it.
      </p>
      <Link
        href="/"
        className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Home className="w-5 h-5" />
        <span>Go to Home</span>
      </Link>
    </div>
  );
}
