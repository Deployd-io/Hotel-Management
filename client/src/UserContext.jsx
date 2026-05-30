import axios from "axios";
const logger = console;
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext({ });

export function UserContextProvider({children}){
	logger.debug(`>>> Entering UserContextProvider(children=${children})`);
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    useEffect(()=>{
	logger.debug(`UserContextProvider: user → ****`);
                if(!user){
                    axios.get('/profile').then((response)=>{
						const _start = Date.now();
						logger.info(`UserContextProvider(children=${children}): API call took ${Date.now() - _start} ms`);
                        setUser(response.data);
                        setReady(true)
                    })
                }
    },[])
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
	logger.debug(`<<< Exiting UserContextProvider(children=${children})`);
}
