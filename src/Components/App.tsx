import './App.css'
import {AuthProvider} from "../Auth/AuthContext.tsx";
import SimpleNavbar from "./General/SimpleNavbar.tsx";
import {Route, Routes} from "react-router-dom";
import {Layout} from "./General/Layout.tsx";
import PublicPage from "./Pages/PublicPage.tsx";
import {LoginForm} from "./Pages/LoginForm.tsx";
import {RequireAuth} from "../Auth/RequireAuth.tsx";
import ProtectedPage from "./Pages/ProtectedPage.tsx";
import {RegisterForm} from "./Pages/RegisterForm.tsx";
import {LogoutForm} from "./Pages/LogoutForm.tsx";

function App() {
  return (
    <>
        <AuthProvider>

            {/* Общий навбар для всего приложения */}
            <SimpleNavbar/>

            {/* Сюда складываются роуты */}
            <Routes>
                {/* А это роут который складывает в себя другие роуты */}
                <Route path='/' element={ <Layout/> }>
                    {/* Пути вложенных роутов идут относительно родительского роута */}
                    {/* index означает, что это ровно тот адрес, который у родительского */}
                    <Route index element={ <PublicPage/> }/>
                    {/* А тут уже будет путь '/' + 'login' = '/login' */}
                    <Route path="login" element={ <LoginForm/> }/>
                    {/* '/' + 'private' = '/private' */}
                    <Route path="private"
                           element={
                               <RequireAuth>
                                   <ProtectedPage/>
                               </RequireAuth>
                           }
                    />
                    {/* и эти по такому же правилу */}
                    <Route path='register' element={ <RegisterForm/> }/>
                    <Route path='logout' element={ <LogoutForm/> }/>
                </Route>

            </Routes>

        </AuthProvider>
    </>
  )
}

export default App
