const React = require('react')
const PropTypes = require('prop-types')
const { Button, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger } = require("@nextui-org/react")
const { generatePassword } = require('../passwordGenerator')
const { Eye, EyeClosed, EyeSlash } = require('@phosphor-icons/react')

/**
 * A modal which enables the user to create an account. Returns a window alert with the status of the action.
 * Don't forget to include const { useDisclosure } = require("@nextui-org/react") in the parent!
 * 
 * @param {object} props Passed in from useDisclosure() parameters in parent.
 */
function AccountCreationCard (props) {
    const { isOpen, onOpenChange } = props

    const [profilePicture, setProfilePicture] = React.useState("botttsNeutral-1695826814739.png")
    const [username, setUsername] = React.useState("")
    const [emailAddress, setEmailAddress] = React.useState("")
    const [password, setPassword] = React.useState("")

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = React.useState(true)
    const [emailInputColor, setEmailInputColor] = React.useState("default")
    const [emailInputDescription, setEmailInputDescription] = React.useState("This is used for email notifications. It can be changed later.")
    const [isFormDisabled, setIsFormDisabled] = React.useState(false)

    const stockImagePath = "pictures/stock_images/"

    const validateEmail = (emailAddress) => emailAddress.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

    const isEmailInvalid = React.useMemo(() => {
        if (emailAddress === "") {
            setEmailInputColor("default")
            setEmailInputDescription("This is used for email notifications. It can be changed later.")
            return false
        }
        if (validateEmail(emailAddress)) {
            setEmailInputColor("success")
            setEmailInputDescription("Email address is valid!")
            return false
        }
        setEmailInputColor("danger")
        setEmailInputDescription("This is used for email notifications. It can be changed later.")
        return true
    }, [emailAddress])

    React.useEffect(() => {
        username != "" && !isEmailInvalid && password != "" ? setIsCreateButtonDisabled(false) : setIsCreateButtonDisabled(true)
    }, [username, emailAddress, password])

    async function createNewAccount(newAccount) {
        console.log(newAccount)
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newAccount)
            })
            if(response.status === 400  || response.status === 500) {
                window.alert((await response.text()).toString())
                setIsFormDisabled(false)
                throw new Error()
            }
            else if(response.status === 200) {
                window.alert(`Your account was created successfully.\nYour session token is:\n${(await response.text()).toString()}`)
                // TODO: Save session token, log in user
            }

        } catch (error) {}
    }

    return (
        <React.Fragment>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={isFormDisabled} isDismissable={!isFormDisabled} size="xl" data-testid="create-account-modal">
            <ModalContent>
            {(onClose) => (
                <React.Fragment>
                    <ModalHeader></ModalHeader>
                    <ModalBody className="grid grid-flow-col auto-cols-max">
                        <div className="pl-2 pr-6 w-48">
                            <Popover showArrow isOpen={isPopoverOpen} onOpenChange={(open) => setIsPopoverOpen(open)} placement="right">
                                <PopoverTrigger>
                                    <Image className="cursor-pointer" src={stockImagePath + profilePicture} width={180} radius="full" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-80">
                                    <div className="grid grid-cols-3 gap-4 py-3 pr-4 overflow-y-scroll">
                                        {
                                            // TODO: Should contain one picture object for each image in directory, have to wait for an API 
                                        }
                                        <Image onClick={() => {
                                            if(!isFormDisabled) {
                                                setProfilePicture("botttsNeutral-1695826814739.png")
                                                setIsPopoverOpen(false)
                                            }
                                        }} className="cursor-pointer" src={stockImagePath + "botttsNeutral-1695826814739.png"} width={100} radius="full" />
                                        <Image onClick={() => {
                                            if(!isFormDisabled) {
                                                setProfilePicture("funEmoji-1695997904423.png")
                                                setIsPopoverOpen(false)
                                            }
                                        }} className="cursor-pointer" src={stockImagePath + "funEmoji-1695997904423.png"} width={100} radius="full" />
                                        <Image onClick={() => {
                                            if(!isFormDisabled) {
                                                setProfilePicture("JaredD-2023.png")
                                                setIsPopoverOpen(false)
                                            }
                                        }} className="cursor-pointer" src={stockImagePath + "JaredD-2023.png"} width={100} radius="full" />
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <p className="text-center pt-2">Click on the photo above to select a different profile picture.</p>
                        </div>
                        <div className="w-72">
                            <Input
                                isReadOnly={isFormDisabled}
                                isRequired
                                label="Username"
                                labelPlacement="outside"
                                color={username != "" ? "success" : "default"}
                                onValueChange={setUsername}
                                size="lg"
                                placeholder="Enter a username..."
                                description="This is your unique identifier across pasma. It cannot be changed once your account is created."
                            />
                            <Input
                                isReadOnly={isFormDisabled}
                                isRequired
                                className="pt-2"
                                type="email"
                                label="Email Address"
                                labelPlacement="outside"
                                isValid={isEmailInvalid}
                                color={emailInputColor}
                                errorMessage={isEmailInvalid && "Please enter a valid email address."}
                                onValueChange={setEmailAddress}
                                size="lg"
                                placeholder="name@domain.com"
                                description={emailInputDescription}
                            />
                            <Input
                                isReadOnly
                                isRequired
                                className="pt-2"
                                label="Password"
                                labelPlacement="outside"
                                type={isPasswordVisible ? "text" :"password"}
                                size="lg"
                                color={password != "" ? "success" : "default"}
                                value={password}
                                onClick={() => {
                                    setPassword("")
                                    setPassword(generatePassword)
                                }}
                                placeholder=" "
                                description={password != "" ? "New password generated. Don't forget to copy this!" : "Click the field to generate a new password."}
                                endContent={
                                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        { isPasswordVisible ? <EyeSlash/> : <Eye/> }
                                    </button>
                                }
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" radius="full" isDisabled={isCreateButtonDisabled} isLoading={isFormDisabled} data-testid="create-account-button" onPress={() => {
                            setIsFormDisabled(true)
                            const newAccount = {
                                "username": username,
                                "password": password,
                                "email": emailAddress,
                                "userType": "standard",
                                "profilePicture": profilePicture
                            }
                            console.log("newAccount")
                            console.log(JSON.parse(JSON.stringify(newAccount)))
                            createNewAccount(JSON.parse(JSON.stringify(newAccount)))
                        }}>
                            Create Account
                        </Button>
                    </ModalFooter>
                </React.Fragment>
            )}
            </ModalContent>
        </Modal>
        </React.Fragment>
    )
}

AccountCreationCard.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired
}

module.exports = AccountCreationCard
