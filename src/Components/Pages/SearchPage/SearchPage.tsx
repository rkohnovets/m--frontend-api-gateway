import { useEffect, useState } from "react"
import { auth_api_https } from "../../../config.ts"
import { UserInfo, useAuth } from "../../../Auth/AuthContext.tsx"
import { Loader } from "../../UI/Loader.tsx"
import { useLocation } from "react-router-dom"
import ProfileSearchResult from "./ProfileSearchResult.tsx"


const SearchPage = () => {
    const { jwt } = useAuth()
    const [ results, setResults ] = useState<UserInfo[] | null>(null)
    if(!jwt)
        return (<p>You are not authenticated</p>)

    let location = useLocation()
    let query: string = location.state?.query
    if(!query)
        return (<p>Empty input</p>)

    const fetchQuery = async () => {
        let response = await fetch(auth_api_https + '/profile/find', {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Authorization": jwt,
                "Content-Type": "application/json",
                "Query": query
            }
        })

        if(response.ok) {
            const res: UserInfo[] = await response.json()
            setResults(res)
        } else {
            let text = await response.text()
            throw`Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    useEffect(() => {
        fetchQuery().catch(console.error)
    }, [location])

    if(!results)
        return (<Loader/>)

    return (
        <div className='max-w-3xl mx-auto'>
            {results.map(item => <ProfileSearchResult {...item}/>)}
        </div>
    )
}

export default SearchPage;