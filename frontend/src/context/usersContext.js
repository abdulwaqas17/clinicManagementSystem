"use client";
import { createContext, useContext, useState } from "react";

const UsersContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
