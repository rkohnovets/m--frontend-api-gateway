import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Auth/AuthContext.tsx";

const SimpleNavbar = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const logOut = () => {
        try {
            auth.signOut(() => navigate('/'));
        } catch(ex) {
            alert(ex);
        }
    };

    const navbarButtonTailwindStyle = 'px-4 pt-2 pb-2.5 mx-1 leading-none rounded hover:bg-gray-700'

    return(
        <nav className="bg-gray-800 text-white py-3 px-4 flex items-center justify-between">
            <div className="flex items-center select-none">
                <h1 className="my-auto text-xl font-bold underline">Vite + React + TS</h1>
                {/*<img style={{width:"35px", margin:"0 10px 0 0"}} src={logo} className="App-logo" alt="logo" />*/}
            </div>
            <div className="flex items-center">
                <NavLink to='/' className="px-4 pt-2 pb-2.5 mx-1 leading-none rounded hover:bg-gray-700">
                    Home
                </NavLink>
                <NavLink to='/private' className="px-4 pt-2 pb-2.5 mx-1 leading-none rounded hover:bg-gray-700">
                    Profile
                </NavLink>
                {
                    auth.user
                        ? (<div
                            className={navbarButtonTailwindStyle}
                            onClick={logOut}>
                            Log Out
                        </div>)
                        : (<>
                            <NavLink to='/login' className={navbarButtonTailwindStyle}>
                                Log In
                            </NavLink>
                            <NavLink to='/register' className={navbarButtonTailwindStyle}>
                                Register
                            </NavLink>
                        </>)
                }
            </div>
        </nav>
    )
}

export default SimpleNavbar