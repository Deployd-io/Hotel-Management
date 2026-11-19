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
                    axios.get('/profile').then((response)=>{
                        setUser(response.data);
                        setReady(true)
                    })
                }
    },[])
	logger.error(`<<< Exiting UserContextProvider(children=${children})`, { "event.action": "UserContextProvider", "logrite.children": children });
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
}
