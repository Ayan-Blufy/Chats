
import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from './Pages/Chatpage';
import { useEffect,useState } from "react"
import Login from './Pages/LoginPage';
import ForgetPage from './Pages/Forgetpage';
import ResetPage from './Pages/ResetPage';



function App() {



  const [user, setUser] = useState();
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
      setUser(data);
    }

    solve()
  }, []);


  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage  />} exact />
          <Route path="/chats" element={<Chatpage />} />
          <Route path="/login" element={<Login/>} /> 
          <Route path="/forgetpassword" element={<ForgetPage />} /> 
          <Route path="/resetpassword/:resetToken" element={<ResetPage />} /> 
        </Routes>
      </div>
     
    </>
  );
}

export default App;
