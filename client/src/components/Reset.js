import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
import validator from "validator";
import { useToast } from "@chakra-ui/react";
import { useNavigate ,useParams} from "react-router-dom";


const Reset = () => {


    const navigate = useNavigate();
const {resetToken}=useParams();


   
    const [show, setShow] = useState(false);
    const toast = useToast();
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();

   
    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {

            if (password && confirmpassword) {
                
                    const res = await fetch(`/api/users/resetpassword/${resetToken}`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({ password,confirmpassword })
                    })
                    const data = await res.json();

                    if (res.status === 201) {

                        navigate("/login");
                        toast({
                            title: "Password is Successfully reset",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top-right",
                        });
                        setLoading(false);
                     

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
    const handleClick = () => setShow(!show);

    return (
        <VStack spacing="10px">
           
            <FormControl id="password" isRequired>
                <FormLabel color="white">New Password</FormLabel>
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
            <FormControl id="password" isRequired>
                <FormLabel color="white">Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmpassword}
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
                Reset
            </Button>

        </VStack>
    );
};

export default Reset;