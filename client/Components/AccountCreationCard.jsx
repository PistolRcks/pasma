const React = require('react')
const PropTypes = require('prop-types')
const { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } = require("@nextui-org/react")

function AccountCreationCard (props) {
    const [username, setUsername] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const validateEmail = (emailAddress) => emailAddress.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (emailAddress === "") return false;
        return validateEmail(emailAddress) ? false : true;
    }, [emailAddress]);

    return (
        <React.Fragment>
            <Button onPress={onOpen}>Create account</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <div>
                    <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                    <ModalBody>
                    <div className="w-full flex flex-row flex-wrap gap-4">
                        <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                            <Avatar src="profile_pictures/botttsNeutral-1695826814739.png" className="w-20 h-20 text-large" />
                        </PopoverTrigger>
                        <PopoverContent className="p-1">
                            <h1>Profile pictures will go here.</h1>
                        </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-full flex flex-row flex-wrap gap-4">
                        <Input
                            isRequired
                            label="Username"
                            labelPlacement="outside"
                            onValueChange={setUsername}
                            size="lg"
                            placeholder=" "
                            description="This is your unique identifier across pasma. It cannot be changed."
                            />
                        <Input
                            isRequired
                            type="email"
                            label="Email Address"
                            labelPlacement="outside"
                            isInvalid={isInvalid}
                            color={isInvalid ? "danger" : "default"}
                            errorMessage={isInvalid && "Please enter a valid email address."}
                            onValueChange={setEmailAddress}
                            size="lg"
                            placeholder=" "
                            description="This is used for email notifications. It can be changed later."
                        />
                        <Input
                            isReadOnly
                            isRequired
                            type="password"
                            label="Password"
                            labelPlacement="outside"
                            size="lg"
                            defaultValue="CHANGE THIS LATER"
                            placeholder=" "
                            description="This will be generated for you. A new one can be generated later."
                        />
                        
                    </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onPress={() => {/* TODO: Make appropriate API call. */console.log("You triggered an API call!")}}>
                            Create account
                        </Button>
                    </ModalFooter>
                </div>
            )}
            </ModalContent>
        </Modal>
        </React.Fragment>
    )
}

module.exports = {
    AccountCreationCard
}
