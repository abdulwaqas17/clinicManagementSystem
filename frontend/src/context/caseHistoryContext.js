"use client";
import { createContext, useContext, useState } from "react";

const CaseHistoryContext = createContext();

export const CaseHistoryProvider = ({ children }) => {
  const [caseHistory, setCaseHistory] = useState([]);
  return (
    <CaseHistoryContext.Provider value={{ caseHistory, setCaseHistory }}>
      {children}
    </CaseHistoryContext.Provider>
  );
};

export const useCaseHistoryContext = () => useContext(CaseHistoryContext);