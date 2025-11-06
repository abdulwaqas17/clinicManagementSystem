"use client";
import { createContext, useContext, useState } from "react";

const ReceptionistContext = createContext();

export const ReceptionistProvider = ({ children }) => {
  const [receptionists, setReceptionists] = useState([]);
  return (
    <ReceptionistContext.Provider value={{ receptionists, setReceptionists }}>
      {children}
    </ReceptionistContext.Provider>
  );
};

export const useReceptionistContext = () => useContext(ReceptionistContext);
