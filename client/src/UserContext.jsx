import axios from "axios";
const logger = console;
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext({ });

export function UserContextProvider({children}){
	logger.error(`>>> Entering UserContextProvider(children=${children})`, { "event.action": "UserContextProvider", "logrite.children": children });
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    useEffect(()=>{
	logger.error(`UserContextProvider: user → ${user}`, { "event.action": "UserContextProvider", "logrite.children": children });
                if(!user){
					logger.error(`UserContextProvider: ready → ${ready}`, { "event.action": "UserContextProvider", "logrite.children": children });
					const _start_UserContextProvider_7 = Date.now();
                    axios.get('/profile').then((response)=>{
                        setUser(response.data);
                        setReady(true)
                    })
                }
					logger.error(`UserContextProvider(children=${children}): API call took ${Date.now() - _start_UserContextProvider_7} ms`, { "event.action": "UserContextProvider", "event.category": "network", "logrite.children": children });
    },[])
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
}
