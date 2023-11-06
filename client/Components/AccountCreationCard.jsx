const React = require('react')
const PropTypes = require('prop-types')
const { Button, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } = require("@nextui-org/react")

function AccountCreationCard (props) {
    const [profilePicture, setProfilePicture] = React.useState("botttsNeutral-1695826814739.png");
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
            {(onClose) => (
                <React.Fragment>
                    <ModalHeader></ModalHeader>
                    <ModalBody className="grid grid-flow-col auto-cols-max">
                        <div className="pl-2 pr-6">
                            <Popover showArrow placement="right">
                            <PopoverTrigger>
                                <Image className="cursor-pointer" src="profile_pictures/botttsNeutral-1695826814739.png" width={180} radius="full" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 max-h-80">
                                <div className="grid grid-cols-3 gap-4 py-3 pr-4 overflow-y-scroll">
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                <Image src="profile_pictures/botttsNeutral-1695826814739.png" width={100} radius="full" />
                                <Image src="profile_pictures/funEmoji-1695997904423.png" width={100} radius="full" />
                                <Image src="profile_pictures/JaredD-2023.png" width={100} radius="full" />
                                </div>
                            </PopoverContent>
                            </Popover>
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
                                onValueChange={setPassword}
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
                </React.Fragment>
            )}
            </ModalContent>
        </Modal>
        </React.Fragment>
    )
}

module.exports = {
    AccountCreationCard
}
