import React, { useEffect, useState } from "react";
import { auth_api_https } from "../config.ts";
import { Loader } from "../Components/UI/Loader.tsx";

type RegisterOrLoginInfo = {
    username: string
    password: string
}

type AuthActionResult = {
    succeeded: boolean
    message: string
}

type UserInfo = {
    id: string
    username: string
    roles: string[]
    name: string
    about: string
    image?: string
}

interface AuthContextType {
    jwt: string | null
    user: UserInfo | null
    //async functions
    updateUserInfo: (jwtstr: string) => Promise<UserInfo>,
    signUp: (user: RegisterOrLoginInfo, callback: VoidFunction) => Promise<AuthActionResult>
    signIn: (user: RegisterOrLoginInfo, callback: VoidFunction) => Promise<AuthActionResult>
    signOut: (callback: VoidFunction) => Promise<AuthActionResult>
}
let AuthContext = React.createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [ user, setUser ] = useState<UserInfo | null>(null)
    let [ jwt, setJWT ] = useState<string | null>(null)
    

    const handleBadRequest = async (action: string, response: Response) => {
        let responseBody = await response.json()

        const devMessage = `Bad request:` +
            `\n\t` + `Action: ${action}` +
            `\n\t` + `Status code: ${response.status}` +
            `\n\t` + `Response body: ${responseBody}`
        console.log(devMessage)

        return responseBody
    }

    const updateUserInfo = async (jwtstr: string) => {
        if(!jwtstr) {
            const message = 'jwt was null in updateUserInfo'
            console.error(message)
            throw message
        }

        let response = await fetch(auth_api_https + '/profile', {
            method: 'GET',
            headers: { 'Authorization': jwtstr },
            mode: 'cors'
        })

        if(!response.ok) {
            const message = `did not get userInfo in updateUserInfo: ${await response.text()}`
            console.error(message)
            throw message
        }

        const userInfo: UserInfo = await response.json()
        setUser(userInfo)

        return userInfo;
    }

    let signUp = async (user: RegisterOrLoginInfo, callback: VoidFunction) => {
        let response = await fetch(auth_api_https + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(user)
        })

        if(!response.ok) {
            const responseBody = await handleBadRequest('signUp', response)
            const asStr = `${responseBody}`
            return {
                succeeded: false,
                message: asStr
            }
        }

        const jwtstr: string = await response.json()
        setJWT(jwtstr)

        localStorage.setItem('jwt', jwtstr)

        await updateUserInfo(jwtstr)

        callback()

        return {
            succeeded: true,
            message: 'Signed up'
        }
    }
    
    let signIn = async (user: RegisterOrLoginInfo, callback: VoidFunction) => {
        //let response = await fetch(auth_api_https + '/auth/login', {
        let response = await fetch('api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(user)
        })
        
        if(!response.ok) {
            const responseBody = await handleBadRequest('signIn', response)
            const asStr = `${responseBody}`
            return {
                succeeded: false,
                message: asStr
            }
        }

        const jwtstr: string = await response.json()
        setJWT(jwtstr)
        localStorage.setItem('jwt', jwtstr)

        await updateUserInfo(jwtstr)

        callback()

        return {
            succeeded: true,
            message: 'Signed in'
        }
    };

    let signOut = async (callback: VoidFunction) => {
        setJWT(null)
        setUser(null)
        localStorage.removeItem('jwt')

        callback()

        return {
            succeeded: true,
            message: 'Signed out'
        }
    }

    const refreshJWT = async (jwtstr: string) => {
        let response = await fetch(auth_api_https + '/auth/refresh-jwt', {
            method: 'GET',
            headers: { 'Authorization': jwtstr },
            mode: 'cors'
        })
        
        if(!response.ok) {
            const text = await response.text()
            throw `could not refresh jwt, response text: ${text}`
        }

        const newjwt: string = await response.json()
        return newjwt
    }

    // "тихая" авторизация при перезагрузке страницы (или открытии приложения заново)
    const [ silentLoading, setSilentLoading ] = useState<boolean>(true)
    useEffect(() => {
        let jwtstr = localStorage.getItem('jwt')
        if(!jwtstr) {
            setSilentLoading(false)
            return
        }

        setSilentLoading(true)
        refreshJWT(jwtstr)
            .then(newjwt => jwtstr = newjwt)
            .then(async () => await updateUserInfo(jwtstr!))
            .then(() => setJWT(jwtstr!))
            .then(() => setSilentLoading(false))
            .catch(e => {
                console.error(e)

                setJWT(null)
                setUser(null)
                localStorage.removeItem('jwt')

                setSilentLoading(false)
            })
    }, [])

    let value : AuthContextType = { jwt, user, updateUserInfo, signIn, signUp, signOut }
  
    return (
        <AuthContext.Provider value={value}>
            {silentLoading ? <Loader/> : children}
        </AuthContext.Provider>
    )
}

// кастомный хук для более удобного получения инфы
// о текущем пользователе (или его отсутствии)
// (возвращает экземпляр AuthContextType)
function useAuth() {
    return React.useContext(AuthContext);
}

export type { RegisterOrLoginInfo, UserInfo }
export { AuthContext, AuthProvider, useAuth }