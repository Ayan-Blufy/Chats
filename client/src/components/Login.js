import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
// import axios from "axios";
import validator from "validator";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const Login = ({ user }) => {


    const navigate = useNavigate();

    const [loguser, setLoggedUser] = useState();
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
            if (res?.status == 200) {
                setLoggedUser(data);
            }
        }

        solve()
    }, [])


    useEffect(() => {
        if (loguser) {
            navigate("/chats");
        }
    }, [loguser])



    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {

            if (email && password) {
                if (!validator.isEmail(email)) {

                    toast({
                        title: "Invalid UserCreditals",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right",
                    });
                    setLoading(false);
                }
                else {
                    const res = await fetch("/api/users/login", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password })
                    })
                    const data = await res.json();

                    if (data.email==email) {
                        console.log(data.email);
                        toast({
                            title: "Login Successfully",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top-right",
                        });
                        setLoading(false);
                        setEmail("");
                        setPassword("");
                        navigate("/chats");

                    }
                    else {

                        toast({
                            title: `${data.msg}`,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top-right",
                        });
                        setLoading(false);
                    }
                }
            }
            else {
                toast({
                    title: "Please fill all the fields",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);

            }
        } catch (err) {
            console.log(err);
        }

    }


    return (
        <VStack spacing="10px">
            <FormControl id="email" isRequired>
                <FormLabel color="white">Email Address</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter Your Email Address"
                    color="white"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel color="white">Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        color="white"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

        </VStack>
    );
};

export default Login;