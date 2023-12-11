const React = require("react");
const {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Input,
    useDisclosure,
} = require("@nextui-org/react");
const { useState, useRef } = require("react");
const { useCookies } = require("react-cookie");
const { useNavigate } = require("react-router");
const PropTypes = require("prop-types");
const { attemptLogin } = require("../dataHelper");

/**
 * Renders a button which displays a modal to allow a user to login.
 *
 * @param {object} props
 *  - text: what to display on the Button component (default: 'Login')
 *  - color: passed into the Button component (default: 'primary')
 *  - size: passed into the Button component (default: 'md')
 *  - variant: passed into the Button component (default: 'solid')
 *  - styling: passed into the Button component's `className` prop (default: '')
 */
function LoginModalButton(props) {
    const { text, color, variant, size, styling } = props;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorText, setErrorText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorPopoverOpen, setIsErrorPopoverOpen] = useState(false);
    
    const passwordRef = useRef(null);

    const doLogin = () => {
        setIsLoading(true);
        attemptLogin(username, password)
            .then((data) => {
                const { token, username, profilePicture, userType } = data;
                console.log(token);
                console.log(username);
                console.log(profilePicture);
                console.log(userType);

                // set cookies
                // expire after one day
                const options = {
                    maxAge: 86400,
                };
                setCookies("token", token, options);
                setCookies("username", username, options);
                setCookies("profilePicture", profilePicture, options);
                setCookies("userType", userType, options);

                // move onward
                navigate("/feed");
            })
            .catch((reason) => {
                // Got an error from the backend; launch the popover
                setErrorText(reason.message);
                setIsErrorPopoverOpen(true);
                setIsLoading(false);
            });
    };

    return (
        <>
            <Button
                color={color}
                variant={variant}
                radius="full"
                size={size}
                className={styling}
                onPress={onOpen}
            >
                {text}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Login
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    labelPlacement="outside"
                                    placeholder="Enter your username"
                                    label="Username"
                                    onValueChange={setUsername}
                                    onKeyDown={(e) => {
                                        // enter being pressed
                                        if (e.keyCode === 13) {
                                            // shift focus
                                            passwordRef.current.focus();
                                        }
                                    }}
                                />
                                <Input
                                    type="password"
                                    ref={passwordRef}
                                    labelPlacement="outside"
                                    placeholder="Enter your password"
                                    label="Password"
                                    onValueChange={setPassword}
                                    onKeyDown={(e) => {
                                        // enter being pressed
                                        if (e.keyCode === 13) {
                                            // login
                                            doLogin()
                                        }
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    radius="full"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Popover
                                    color="danger"
                                    isOpen={isErrorPopoverOpen}
                                    onOpenChange={(open) =>
                                        setIsErrorPopoverOpen(open)
                                    }
                                >
                                    <PopoverTrigger>
                                        <Button
                                            color="primary"
                                            disabled={isLoading}
                                            isLoading={isLoading}
                                            onPress={doLogin}
                                            radius="full"
                                        >
                                            Login
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2">
                                            <div className="text-small font-bold">
                                                Error
                                            </div>
                                            <div className="text-tiny">
                                                {errorText}
                                                <br />
                                                Check your username and password
                                                and try again.
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

LoginModalButton.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    variant: PropTypes.string,
    styling: PropTypes.string,
};

LoginModalButton.defaultProps = {
    text: "Login",
    color: "primary",
    variant: "solid",
    size: "md",
    styling: "",
};

module.exports = LoginModalButton;
