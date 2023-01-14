import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();

    // useEffect(() => {
        
    //     async function solve(){
    //         const res = await fetch("/api/users/root", {
    //             method: "GET",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: "include",
    //         });
    //         const data = await res.json();
    //         if (res.status == 200) {
    //         setUser(data);
    //         }
    //         else{
    //             navigate("/login")
    //         }
            
    //     }

    //     solve();

    //     // if (!user) navigate("/login");
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider