import React from "react";
import {useNavigate} from "react-router-dom";
import LoadingComponent from "../LoadingComp/LoadingComponent";

export const AuthRoute = ({children}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    // get user from localStorage
    const user = JSON.stringify(localStorage.getItem("userInfo"));
    // check if user has logged in or not
    const isLoggedIn = user?.token ? true : false;

    // if user is unauthorized to access protected page, user will redirect to login page.
    React.useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }

        setIsLoading(false)
    }, [isLoggedIn, navigate])

    // return page if authorized.
    return isLoading ? <LoadingComponent/> : <>{children}</>
}