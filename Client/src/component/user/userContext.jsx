
import { Children, createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    });
  
    return (
      <UserContext.Provider value={{ user, setUser }}> 
        {children}
      </UserContext.Provider>
    )
  }