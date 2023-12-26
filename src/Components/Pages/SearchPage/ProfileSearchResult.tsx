import { NavLink } from "react-router-dom";
import { UserInfo } from "../../../Auth/AuthContext";
import styles from './ProfileSearchResult.module.css'

const ProfileSearchResult = (user: UserInfo) => {
    const arrowRightIcon = (
        <svg id="Layer_1" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="m405.333 268h-298.666c-6.627 0-12-5.373-12-12s5.373-12 12-12h298.666c6.627 0 12 5.373 12 12s-5.373 12-12 12z"/>
            <path fill="white" d="m305.797 348.291c-3.504 0-6.977-1.527-9.348-4.467-4.161-5.158-3.352-12.713 1.807-16.874l87.963-70.95-87.963-70.95c-5.159-4.161-5.967-11.716-1.807-16.874 4.161-5.159 11.716-5.967 16.874-1.807l99.543 80.29c2.824 2.278 4.466 5.712 4.466 9.34s-1.642 7.062-4.466 9.34l-99.543 80.29c-2.218 1.791-4.881 2.661-7.526 2.662z"/>
        </svg>
    )

    return (
        <div className={`${styles.container} my-1 rounded-2xl h-12 bg-indigo-100 active:bg-indigo-400  hover:bg-indigo-200`}>
            <div className='m-2 rounded-full bg-indigo-700 text-white flex items-center justify-center'>
                <p>img</p>
            </div>
            <div className='m-2 text-indigo-500 flex items-center'>
                <p>{user.name} @{user.username}</p>
            </div>
            <NavLink to={`/profile/${user.id}`}>
                <div className='m-2 rounded-full bg-indigo-700 text-white flex items-center justify-center'>
                    {arrowRightIcon}
                </div>
            </NavLink>
        </div>
    )
}

export default ProfileSearchResult