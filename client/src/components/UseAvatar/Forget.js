import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
// import axios from "axios";
import validator from "validator";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const Forget = ({ user }) => {


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
            setLoggedUser(data);
        }

        solve()
    }, [])


    useEffect(() => {
        if (loguser) {
            navigate("/chats");
        }
    }, [loguser])
    const [show, setShow] = useState(false);
    const toast = useToast();
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {

            if (email) {
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
                    const res = await fetch("/api/users/forgetpassword", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({ email })
                    })
                    const data = await res.json();

                    if (res.status === 201) {

                        toast({
                            title: "Email Send Successfully",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top-right",
                        });
                        setLoading(false);
                        setEmail("");
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
            
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Send
            </Button>

        </VStack>
    );
};

export default Forget;