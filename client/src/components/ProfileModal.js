import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
} from "@chakra-ui/react";

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
          {children ? (
              <span onClick={onOpen}>{children}</span>
           
          ) : (
                  <IconButton display={{ base: "flex" }} bg="#131324" color="white" _hover={{ backgroundColor: "#131324" }} _active={{ backgroundColor: "#131324" }} icon={<ViewIcon color="white" backgroundColor="#131324" />} onClick={onOpen} />
          )}
          <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent h="410px">
                  <ModalHeader
                      fontSize="40px"
                      fontFamily="Work sans"
                      display="flex"
                      justifyContent="center"
                      bg="#131324"
                      color="white"
                  >
                      {(user?.name)}
                  </ModalHeader>
                  <ModalCloseButton color="white"/>
                  <ModalBody
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="space-between"
                      bg="#131324"
                      color="white"
                  >
                      <Image
                          borderRadius="full"
                          boxSize="150px"
                          src={user?.pic}
                          alt={user?.name}
                      />
                      <Text
                          fontSize={{ base: "28px", md: "30px" }}
                          fontFamily="Work sans"
                      >
                          Email: {user?.email}
                      </Text>
                  </ModalBody>
                  <ModalFooter   bg="#131324"
                      >
                      <Button onClick={onClose}>Close</Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
    </>
  )
}

export default ProfileModal
