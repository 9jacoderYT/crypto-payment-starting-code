"use client";

import { useEffect, useState, ReactNode } from "react";
import Navbar from "./navbar";
import { Footer } from "./footer";

interface LayoutWrapperProps {
  children: ReactNode; // Define the type for children
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []); // Include an empty dependency array to run only on mount

  if (!isMounted) return null; // Return null instead of undefined

  
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
