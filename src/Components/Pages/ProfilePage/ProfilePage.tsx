import { Fragment, useEffect, useState } from "react"
import { auth_api_https, backend_api_https } from "../../../config.ts"
import { UserInfo, useAuth } from "../../../Auth/AuthContext.tsx"
import { Loader } from "../../UI/Loader.tsx"
import styles from './ProfilePage.module.css'
import ProfileInput from "../../UI/ProfileInput/ProfileInput.tsx"
import { useNavigate, useParams } from "react-router-dom"
import { Chat, UserChats } from "../../../Types/ChatTypes.tsx"
import { ButtonWithLoader } from "../../UI/ButtonWithLoader.tsx"

// пока что пусть можно обновить только 3 поля
type UserInfoToUpdate = {
    name?: string,
    username?: string,
    about?: string
}

const ProfilePage = () => {
    const { jwt, user, updateUserInfo } = useAuth()
    const [ name, setName ] = useState<string>('')
    const [ username, setUsername ] = useState<string>('')
    const [ about, setAbout ] = useState<string>('')
    const [ loaded, setLoaded ] = useState<boolean>(false)
    //const [ userChats, setUserChats ] = useState<UserChats | null>(null)
    const [ sharedChat, setSharedChat ] = useState<Chat | null>(null)
    const navigate = useNavigate()
    
    const { id : userId } = useParams()
    
    if(!jwt)
        return (<p>You are not authenticated</p>)

    const thisUser = !userId || user?.id == userId

    const fetchUser = async () => {
        const url = userId
            ? auth_api_https + '/profile/id/' + userId
            : auth_api_https + '/profile'

        let response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const userInfo = await response.json()
            return userInfo
        } else {
            let text = await response.text()
            throw `Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const fetchUserChats = async () => {
        let response = await fetch(
            backend_api_https + '/chats/', 
            {
                method: 'GET',
                mode: 'cors',
                headers: { "Authorization": jwt }
            }
        )

        if(response.ok) {
            const body = await response.json()
            return body
        } else {
            let text = await response.text()
            throw `Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const fetchChat = async (chatId: string) => {
        let response = await fetch(
            backend_api_https + '/chats/' + chatId, 
            {
                method: 'GET',
                mode: 'cors',
                headers: { "Authorization": jwt }
            }
        )

        if(response.ok) {
            const body = await response.json()
            return body
        } else {
            let text = await response.text()
            throw `Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    useEffect(() => {
        setLoaded(false)
        //updateUserInfo(jwt)
        fetchUser()
            .then((userInfo: UserInfo) => {
                setName(userInfo.name)
                setUsername(userInfo.username)
                setAbout(userInfo.about)
            })
            .then(fetchUserChats)
            .then(async (chats: UserChats) => {
                for(let chatInfo of chats.other) {
                    const chat : Chat = await fetchChat(chatInfo.chat)
                    let breakCycle = false
                    for(let ChatUser of chat.users)
                        if(ChatUser.user == userId) {
                            setSharedChat(chat)
                            breakCycle = true
                            break
                        }
                    if(breakCycle)
                        break
                }

                //setUserChats(chats)
            })
            .then(() => setLoaded(true))
            .catch(console.error)
    }, [userId])

    if(!loaded)
        return (<Loader/>)

    const updateUserProfile = async (uito: UserInfoToUpdate) => {
        if(!thisUser)
            return

        let response = await fetch(auth_api_https + '/profile', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Authorization": jwt,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uito)
        })

        if(response.ok) {
            const userInfo = await updateUserInfo(jwt)
            if(uito.name)
                setName(userInfo.name)
            if(uito.username)
                setUsername(userInfo.username)
            if(uito.about)
                setAbout(userInfo.about)
        } else {
            let text = await response.text()
            throw`Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const saveName = async () => { 
        await updateUserProfile({ name: name })
    }

    const saveUsername = async () => {
        await updateUserProfile({ username: username })
    }

    const saveAbout = async () => {
        await updateUserProfile({ about: about })
    }

    const createChat = async () => {
        let response = await fetch(backend_api_https + '/chats/user/' + userId, {
            method: 'POST',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const createdChat: Chat = await response.json()
            setSharedChat(createdChat)
        } else {
            let text = await response.text()
            throw`Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    return (
        <div className={styles.profileInfoContainer + ' max-w-3xl mx-auto mt-3 bg-indigo-100 rounded px-5 py-3'}>
            <div className={'bg-green-100 mr-5 flex justify-center items-center rounded ' + styles.image}>IMG</div>
            <ProfileInput
                editable={thisUser} name='name' value={name} 
                labelText='Name' onChange={setName} onSubmit={saveName}/>
            <ProfileInput 
                editable={thisUser} name='username' value={username} 
                labelText='Username' onChange={setUsername} onSubmit={saveUsername}/>
            <div className={styles.aboutDiv}>
                <ProfileInput multiline={true}
                    editable={thisUser} name='about' value={about} 
                    labelText='About' onChange={setAbout} onSubmit={saveAbout}/>
                {
                    !thisUser 
                        ? (sharedChat 
                            ? <ButtonWithLoader text="Go to chat" loadingText="..." onClick={async () => navigate('/chats/' + sharedChat.id, { replace: true })}/>
                            : <ButtonWithLoader text="Create chat" loadingText="Wait..." onClick={createChat}/>)
                        : <Fragment/>

                }
            </div>
        </div>
    )
}

export default ProfilePage;