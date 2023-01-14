import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { encode, decode } from 'string-encode-decode'
// import axios from "axios";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ProfileModal from "../components/ProfileModal";
import ScrollableChat from "../components/ScrollableChat";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
import Welcome from "./Welcome";
// import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
// import { IoMdSend } from "react-icons/io";
import io from "socket.io-client";
import UpdateGroupChatModal from "../components/miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "https://next101.herokuapp.com/"; // "https://next100.herokuapp.com/"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const [showEmojis, setShowEmojis] = useState(false);

    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice",
    //     },
    // };
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {


            setLoading(true);


            const res = await fetch(`/api/messages/${selectedChat._id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                credentials: "include"
            });
            const data = await res.json();
            setMessages(data);
            // console.log(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    const sendMessage = async (event) => {
        event.preventDefault();

        if (newMessage) {
            // socket.emit("stop typing", selectedChat._id);
            try {
                
                
                const res = await fetch(`/api/messages`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,

                    },
                    credentials: "include",
                    body: JSON.stringify({  
                        content: encode(newMessage),
                        chatId: selectedChat,
                    }),
                
                });
                const data = await res.json();
                socket.emit("new message", data);
                setMessages([...messages, data]);
                 setNewMessage("")
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
        else{
            toast({
                title: "Error Occured",
                description: "Please enter text in field",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        }
    };

  
    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ){} else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // if (!socketConnected) return;

        // if (!typing) {
        //     setTyping(true);
        //     socket.emit("typing", selectedChat._id);
        // }
        // let lastTypingTime = new Date().getTime();
        // var timerLength = 3000;
        // setTimeout(() => {
        //     var timeNow = new Date().getTime();
        //     var timeDiff = timeNow - lastTypingTime;
        //     if (timeDiff >= timerLength && typing) {
        //         socket.emit("stop typing", selectedChat._id);
        //         setTyping(false);
        //     }
        // }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                        color="white"
                       
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                            bg="#131324"
                            color="white"
                            _hover={{ backgroundColor: "#131324" }} _active={{ backgroundColor: "#131324" }}
                        />
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        // bg="#E8E8E8"
                        w="100%"
                        h="550px"
                        borderRadius="lg"
                        overflowY="scroll"
                        bg="#00000076"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">

                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl

                            id="first-name"
                            isRequired
                            mt={3}
                          
                        >
                           

                            <Box display="flex" flexDir="row" >

                                <Input
                                    variant="filled"
                                    bg="#131324"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                    width="90%"
                                    autoComplete="none"
                                    autoCorrect="none"
                                    color="white"
                                    _hover={{ backgroundColor: "#131324" }}
                                    outline="none"
                                />
                                <IconButton
                                    display={{ base: "flex" }}
                                    icon={<ArrowForwardIcon w={12} h={8} color="white" _hover={{ color: "green.300"}} />}
                                    onClick={sendMessage}
                                    width="10%"
                                    bg="green.300"
                                />
                            </Box>

                        </FormControl>
                    </Box>
                </>
            ) : (
                // to get socket.io on same page
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">

                    <Welcome user={user} />
                </Box>
            )}
        </>
    );
};

export default SingleChat;