const React = require('react')
const PropTypes = require('prop-types')
const { Button, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } = require("@nextui-org/react")

function AccountCreationCard (props) {
    const [profilePicture, setProfilePicture] = React.useState("profile_pictures/botttsNeutral-1695826814739.png");
    const [username, setUsername] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const validateEmail = (emailAddress) => emailAddress.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (emailAddress === "") return false;
        return validateEmail(emailAddress) ? false : true;
    }, [emailAddress]);

    

    return (
        <React.Fragment>
            <Button onPress={onOpen}>Create account</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
            {(onClose) => (
                <React.Fragment>
                    <ModalHeader></ModalHeader>
                    <ModalBody className="grid grid-flow-col auto-cols-max">
                        <div className="pl-2 pr-6 w-48">
                            <Popover showArrow isOpen={isPopoverOpen} onOpenChange={(open) => setIsPopoverOpen(open)} placement="right">
                            <PopoverTrigger>
                                <Image className="cursor-pointer" src={profilePicture} width={180} radius="full" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 max-h-80">
                                <div className="grid grid-cols-3 gap-4 py-3 pr-4 overflow-y-scroll">
                                    {/* TODO: Should contain one picture object for each image in directory, have to wait for an API */}
                                    <Image onClick={() => {
                                        setProfilePicture("profile_pictures/botttsNeutral-1695826814739.png")
                                        setIsPopoverOpen(false)
                                    }} className="cursor-pointer" src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                    <Image onClick={() => {
                                        setProfilePicture("profile_pictures/funEmoji-1695997904423.png")
                                        setIsPopoverOpen(false)
                                    }} className="cursor-pointer" src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                    <Image onClick={
                                        () => {setProfilePicture("profile_pictures/JaredD-2023.png")
                                        setIsPopoverOpen(false)
                                    }} className="cursor-pointer" src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                </div>
                            </PopoverContent>
                            </Popover>
                            <p className="text-center pt-2">Click on the photo above to select a different profile picture.</p>
                        </div>
                        <div className="w-72">
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
                                className="pt-2"
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
                                className="pt-2"
                                label="Password"
                                labelPlacement="outside"
                                size="lg"
                                color={password != "" ? "success" : "default"}
                                defaultValue="CHANGE THIS LATER"
                                value={password ? password : " "}
                                onClick={() => {
                                    // TODO: Implement Jared's password generator
                                    setPassword("generated-password-123")

                                }}
                                placeholder=" "
                                description={password != "" ? "New password generated. Don't forget to copy this!" : "Click the field to generate a new password and copy it."}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onPress={() => {/* TODO: Make appropriate API call. */console.log("You triggered an API call!")}}>
                            Create account
                        </Button>
                    </ModalFooter>
                </React.Fragment>
            )}
            </ModalContent>
        </Modal>
        </React.Fragment>
    )
}

module.exports = AccountCreationCard

