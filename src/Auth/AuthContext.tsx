import React from "react";
import { api_https } from "../config.ts";

type RegisterOrLoginInfo = {
    username: string
    password: string
}
type AuthActionResult = {
    succeeded: boolean
    message: string
}

type UserInfo = {
    username: string
    id: string
    roles: string[]
}

type User = {
    user: UserInfo
    jwt: string
}

interface AuthContextType {
    user: User | null
    //async functions
    signUp: (user: RegisterOrLoginInfo, callback: VoidFunction) => Promise<AuthActionResult>
    signIn: (user: RegisterOrLoginInfo, callback: VoidFunction) => Promise<AuthActionResult>
    signOut: (callback: VoidFunction) => Promise<AuthActionResult>
}
let AuthContext = React.createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<User | null>(null)

    const handleBadRequest = async (action: string, response: Response) => {
        let responseBody = await response.json()

        const message = `Bad request...` +
            `\n` + `Action: ${action}` +
            `\n` + `Status code: ${response.status}` +
            `\n` + `Response body: ${responseBody}`

        //alert(message)
        console.log(message)

        return responseBody
    }

    let signUp = async (user: RegisterOrLoginInfo, callback: VoidFunction) => {
        let response = await fetch(api_https + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(user)
        })
        
        if(response.ok) {
            const user : User = await response.json()
            setUser(user)

            callback()

            return {
                succeeded: true,
                message: 'Signed up (registered and authenticated)'
            }
        } else {
            // там по идее строка
            const responseBody = await handleBadRequest('signUp', response)
            const asStr = `${responseBody}`
            return {
                succeeded: false,
                message: asStr
            }
        }
    }
    
    let signIn = async (user: RegisterOrLoginInfo, callback: VoidFunction) => {
        let response = await fetch(api_https + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(user)
        })
        
        if(response.ok) {
            const user : User = await response.json()
            setUser(user)

            callback()

            return {
                succeeded: true,
                message: 'Signed in (authenticated)'
            }
        } else {
            // там по идее строка
            const responseBody = await handleBadRequest('signUp', response)
            const asStr = `${responseBody}`
            return {
                succeeded: false,
                message: asStr
            }
        }
    };

    let signOut = async (callback: VoidFunction) => {
        setUser(null);

        callback();

        return {
            succeeded: true,
            message: 'Signed out'
        }
    };

    let value : AuthContextType = { user, signIn, signUp, signOut };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// кастомный хук для более удобного получения инфы
// о текущем пользователе (или его отсутствии)
// (возвращает экземпляр AuthContextType)
function useAuth() {
    return React.useContext(AuthContext);
}

export type { RegisterOrLoginInfo, UserInfo, User }
export { AuthContext, AuthProvider, useAuth }