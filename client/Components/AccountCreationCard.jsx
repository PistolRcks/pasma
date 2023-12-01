const React = require('react')
const { useNavigate } = require('react-router-dom')
const { useCookies } = require('react-cookie')
const PropTypes = require('prop-types')
const { Button, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Skeleton, Spinner } = require("@nextui-org/react")
const { generatePassword } = require('../passwordGenerator')
const { Eye, EyeSlash } = require('@phosphor-icons/react')
const { getAllProfilePictures } = require('../dataHelper.js')

/**
 * A modal which enables the user to create an account. Returns a window alert with the status of the action.
 * Don't forget to include const { useDisclosure } = require("@nextui-org/react") in the parent!
 * 
 * @param {object} props Passed in from useDisclosure() parameters in parent.
 */
function AccountCreationCard (props) {
    const { isOpen, onOpenChange } = props
    const navigateTo = useNavigate();
    const [cookies, setCookie] = useCookies(["token", "username", "profilePicture", "userType"])
    const [profilePictures, setProfilePictures] = React.useState([]);

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

    const imagePath = "pictures/profile_pictures/"

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
        // TODO: Load profile pics here
    }, [])

    React.useEffect(() => {
        username != "" && !isEmailInvalid && password != "" ? setIsCreateButtonDisabled(false) : setIsCreateButtonDisabled(true)
    }, [username, emailAddress, password])

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
                                    {
                                        // TODO: Skeleton until first image in array loaded
                                    }
                                    <Skeleton className="rounded-full" isLoaded={profilePictures.length > 0}>
                                        <Image className="cursor-pointer" src={imagePath + profilePicture} width={180} radius="full" />
                                    </Skeleton>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-80">
                                        {profilePictures.length > 0 ?
                                            <div className="grid grid-cols-3 gap-4 py-3 pr-4 overflow-y-scroll">
                                                {profilePictures.map((item, index) => (
                                                    <Image key={item} onClick={() => {
                                                        if(!isFormDisabled) {
                                                            setProfilePicture(image)
                                                            setIsPopoverOpen(false)
                                                        }
                                                    }} className="cursor-pointer" src={imagePath + item} width={100} radius="full" />
                                                ))}
                                            </div>
                                            :
                                            <div className="py-5 flex items-center"><Spinner color="warning"/><p className="pl-2">Loading profile pictures...</p></div>
                                            
                                        }
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
                                    if(!isFormDisabled){
                                        const newPassword = generatePassword(2)
                                        setPassword("")
                                        setPassword(newPassword)
                                        navigator.clipboard.writeText(newPassword)
                                    }
                                }}
                                placeholder=" "
                                description={password != "" ? "Copied to clipboard. Don't forget to save this!" : "Click the field to generate a new password."}
                                endContent={
                                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        { isPasswordVisible ? <EyeSlash/> : <Eye/> }
                                    </button>
                                }
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={isCreateButtonDisabled ? "default" : "primary"} radius="full" isDisabled={isCreateButtonDisabled} isLoading={isFormDisabled} data-testid="create-account-button" onPress={() => {
                            setIsFormDisabled(true)
                            const newAccount = {
                                "username": username,
                                "password": password,
                                "email": emailAddress,
                                "userType": "standard",
                                "profilePicture": profilePicture
                            }
                            // console.log("newAccount")
                            // console.log(JSON.parse(JSON.stringify(newAccount)))
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
