import { useState } from "react";
import { User } from "../../interface/models/user";
import { JwtPayload, jwtDecode} from 'jwt-decode';
 
 
interface Payload extends JwtPayload {
    userId? : string;
  }
   
  export const useLocalStorage = () => {
    const keyName = 'token';
    const defaultValue = null;
    const [storedValue, setStoredValue] = useState<User | null>(() => {
      try {
        const value = localStorage.getItem(keyName);
   
        if (value) {
   
          const user = jwtDecode(value) as Payload;
         console.log("email", user.userId)
          return {
            email:user.userId
          }
        } else {
          //localStorage.setItem(keyName, JSON.stringify(defaultValue));
          return null;
        }
      } catch (err) {
        return defaultValue;
      }
    });
    const setValue = (newValue: string | null) => {
      try {
        if (newValue) {
          localStorage.setItem("token", newValue);
          const user = jwtDecode(newValue) as Payload;
        //   console.log("email 2", user as User)
          setStoredValue({
            email:user.userId
          });
        } else {
            setStoredValue(null)
          localStorage.removeItem("token")
        }
   
      } catch (err) {}
    };
    return {storedValue, setValue};
  }