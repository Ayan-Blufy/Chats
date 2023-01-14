import React, { useState, useEffect } from 'react'
import { Box } from "@chakra-ui/layout";
import Chatbox from '../components/Chatbox';
import MyChats from '../components/MyChats';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from 'react-router-dom';

const Chatpage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  const [loguser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat,setUser,user, chats, setChats } = ChatState();
  const navigate=useNavigate();
  useEffect(() => {
    async function solve() {
      const res = await fetch("/api/users/root", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await res.json();
      setLoggedUser(data);
      setUser(data);
    }
    
    solve()
    if(!user) navigate("/login");
  },[])

  return (

    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display="flex" flexDir={{ base: "column", md: "row" }} justifyContent={{ base: "space-around", md: "space-between" }} width="100%" height="90%" pl="20px" pr="20px" pb="10px" pt="40px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>


  )
}

export default Chatpage
