import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image
} from "@chakra-ui/react";
import { useEffect } from "react";
import Logo from "../assets/logo.svg";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { Link } from "react-router-dom"
function Homepage() {


  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="#131324"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >

        {/* <Image src={Logo} alt='Dan Abramov' className="adj"/> */}
        <div className="brand">
          <Image src={Logo} alt="" className="img" />
          <Text fontSize="4xl" textAlign="center" color="white" fontWeight="900" fontFamily="Work sans">
            SNAPPY
          </Text>
        </div>
      </Box>
      <Box bg="#131324" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Text fontSize="2xl" textAlign="center" color="white" fontWeight="900" fontFamily="Work sans">
          SIGN UP
        </Text>
        <Signup  />

        <Text fontSize="xl" textAlign="center" color="white" fontWeight="200" fontFamily="Work sans">
          Already have an account ? <Link to="/login" fontSize="sm" className="link">Login.</Link>
        </Text>


      </Box>

    </Container>
  );
}

export default Homepage;
