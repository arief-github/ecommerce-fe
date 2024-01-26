import React from 'react';

export const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = user?.userFound?.isAdmin ? true : false;

    if(!isAdmin) return <h1>Access Denied, Only Admin can Access this page!</h1>

    return <>{children}</>
}