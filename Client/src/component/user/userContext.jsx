import axios from "axios";
import { createContext, useState } from "react";


// En tu contexto de usuario
export const UserContext = createContext()



export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // const serverFront = "http://localhost:3001"; 
  const serverFront = "https://billetera-virtual-1.onrender.com"

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${serverFront}/api/auth/name`, { headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }, withCredentials: true });
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('error al obtener los datos del usuario');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData, error }}>
      {children}
    </UserContext.Provider>
  );
};