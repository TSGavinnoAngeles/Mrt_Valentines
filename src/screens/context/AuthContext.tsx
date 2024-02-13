import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./localstorage";
import { User } from "../../interface/models/user";
import { TokenClass, tokenToString } from "typescript";

const defaultUser: User = {
    email: undefined,
  }
  const AuthContext = createContext({
    user: defaultUser,
    login:  (token: string)=>{},
    logout: ()=>{},
  });
  
  export const AuthProvider = ({ children }: {children: any}) => {
    const navigate = useNavigate();
    const {storedValue: user, setValue: setUser} = useLocalStorage();
  
    // call this function when you want to authenticate the user
    const login = async (token: string) => {
      console.log("token", token)
      setUser(token);
      console.log("user", user)
      console.log("redirection trial")
      navigate("/admin-dashboard/UUID-Editor");
    };
  
    // call this function to sign out logged in user
    const logout = () => {
      setUser(null);
      navigate("/", { replace: true });
    };
  
    const value = useMemo(
      () => ({
        user: user as User,
        login,
        logout,
      }),
      [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };