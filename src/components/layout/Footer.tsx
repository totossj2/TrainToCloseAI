import React from "react";
import { Mic, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Mic className="h-6 w-6 text-teal-400" />
          <span className="text-xl font-bold">Train To Close</span>
        </div>
        <p className="text-gray-400 mb-4">
          Built with <span className="text-teal-400">♥</span> by Lorenzo
          Ferrario — Currently in beta.
        </p>
        <a
          href="mailto:salespitchpro@gmail.com"
          className="inline-flex items-center text-teal-400 hover:underline"
        >
          <Mail className="h-4 w-4 mr-1" /> contact@traintoclose.com
        </a>
        <p className="text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Train To Close. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
