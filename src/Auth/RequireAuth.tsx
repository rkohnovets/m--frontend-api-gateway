import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";

/*

Применение - редиректит на логин, если пользователь не аутентифицирован. 
Если пользователь аутентифицирован, то выдаёт то, что внутри (в данном примере <ProtectedPage/>)

<Route path="private"
    element={
    <RequireAuth>
        <ProtectedPage/>
    </RequireAuth>
    }
/>

*/

export function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}