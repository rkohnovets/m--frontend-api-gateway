import './App.css'
import { AuthProvider } from "../Auth/AuthContext.tsx";
import SimpleNavbar from "./General/SimpleNavbar.tsx";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./General/Layout.tsx";
import HomePage from "./Pages/HomePage.tsx";
import { LoginForm } from "./Pages/LoginForm.tsx";
import RequireAuth from "../Auth/RequireAuth.tsx";
import ProfilePage from "./Pages/ProfilePage/ProfilePage.tsx";
import { RegisterForm } from "./Pages/RegisterForm.tsx";
import { LogoutForm } from "./Pages/LogoutForm.tsx";
import ChatsListPage from "./Pages/ChatsListPage.tsx";
import ChatPage from "./Pages/ChatPage/ChatPage.tsx";
import SearchPage from './Pages/SearchPage/SearchPage.tsx';

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
                    <Route index element={ <HomePage/> }/>
                    {/* А тут уже будет путь '/' + 'login' = '/login' */}
                    <Route path="login" element={ <LoginForm/> }/>
                    {/* '/' + 'profile' = '/profile' */}
                    <Route path="profile"
                           element={
                               <RequireAuth>
                                   <ProfilePage/>
                               </RequireAuth>
                           }
                    />
                    <Route path="profile/:id"
                           element={
                               <RequireAuth>
                                   <ProfilePage/>
                               </RequireAuth>
                           }
                    />
                    {/* и эти по такому же правилу */}
                    <Route path='register' element={ <RegisterForm/> }/>
                    <Route path='logout' element={ <LogoutForm/> }/>

                    <Route path="chats"
                           element={
                               <RequireAuth>
                                   <ChatsListPage/>
                               </RequireAuth>
                           }
                    />

                    <Route path="chats/:id" element={
                        <RequireAuth>
                            <ChatPage/>
                        </RequireAuth>
                    }/>

                    <Route path="search" element={
                        <RequireAuth>
                            <SearchPage/>
                        </RequireAuth>
                    }/>
                </Route>
            </Routes>
        </AuthProvider>
    </>
  )
}

export default App
