import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validator from 'validator';

const Signup = () => {

    const [loguser,setLoggedUser]=useState();
    useEffect(()=>{
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
        }

        solve()
    },[])



    const navigate = useNavigate();
    useEffect(()=>{
        if (loguser)
        {
            navigate("/chats");
        }

    }, [loguser]);
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
 

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const submitHandler = async () => {
        setPicLoading(true);
        try {
            if (name && email && password && confirmpassword ) {

                if (password !== confirmpassword) {
                    toast({
                        title: "Password Incorrect",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                }
                else {

                    if (!validator.isEmail(email)) {
                        toast({
                            title: "Invalid email.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "bottom",
                        });
                    }
                    else {
                        if (name.length < 3) {
                            toast({
                                title: "Username should be greater than 3 characters.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                            });

                        }
                        else if (password.length < 4) {

                            toast({
                                title: "Password should be equal or greater than 4 characters.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                            });
                        }
                        else {

                            const res = await fetch("/api/users/register", {

                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ name, email, password, confirmpassword, pic })
                            })
                            const data = await res.json();
                            if (res.status === 201) {
                                setName("")
                                setEmail("")
                                setConfirmpassword("")
                                setPassword("")
                                setPic("")
                                toast({
                                    title: `${data.msg}`,
                                    status: "success",
                                    duration: 5000,
                                    isClosable: true,
                                    position: "top-right",
                                });
                                navigate("/login");
                            }
                            else {

                                toast({
                                    title: `${data.msg}`,
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                    position: "top-right",
                                });
                            }


                        }




                    }
                }

            } else {
                toast({
                    title: "Please fill all the fields",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });

            }

        } catch (err) {
            console.log(err);
        }
        setPicLoading(false);
    };

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "File_tourl");
            // data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/dn72iqxez/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel color="white">Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    value={name}
                    color="white"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel color="white">Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    color="white"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel color="white">Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        color="white"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel color="white">Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmpassword}
                        color="white"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel color="white">Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    color="white"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={picLoading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;