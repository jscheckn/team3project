import {createContext, useContext, useEffect, useState} from "react";

type AuthContext = {
  loggedIn: boolean,
  setLoggedIn: (loggedIn: boolean) => void
}

const authContext = createContext({
  loggedIn: false,
  setLoggedIn: () => {}
} as AuthContext);

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({children}: {children: any}) => {

  const probablyLoggedIn = /token=[^;]/.test(document.cookie);
  const [loggedIn, setLoggedIn] = useState(probablyLoggedIn);

  useEffect(() => {
    fetch('/api/accounts/validate')
      .then(res => setLoggedIn(res.ok));
  }, []);

  return (
    <authContext.Provider value={{loggedIn, setLoggedIn}}>
      {children}
    </authContext.Provider>
  )
};
