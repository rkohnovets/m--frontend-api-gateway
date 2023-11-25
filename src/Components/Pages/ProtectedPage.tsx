import { useEffect, useState } from "react";
import { api_https } from "../../config.ts";
import type { UserInfo } from "../../Auth/AuthContext.tsx";
import { useAuth } from "../../Auth/AuthContext.tsx";

const ProtectedPage = () => {
    const { user } = useAuth()

    if(!user)
        return (<p>You are not authenticated</p>)

    interface UserInfoResponse {
        user: UserInfo
    }

    const [ userInfo, setUserInfo ] = useState<UserInfo | null>(null);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            let response = await fetch(api_https + '/auth/userinfo', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Authorization": `Bearer ${user.jwt}`
                }
            })

            if(response.ok) {
                const uir : UserInfoResponse = await response.json()
                setUserInfo(uir.user)
            } else {
                let text = await response.text()
                alert("Code " + response.status + ", message: " + text)
            }
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error)
    }, [])

    return <div>
        <p>User info: { userInfo ? JSON.stringify(userInfo) : "loading..." }</p>
    </div>;
}

export default ProtectedPage;