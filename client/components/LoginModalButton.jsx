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
const { useState } = require("react");
const { useCookies } = require("react-cookie");
const { useNavigate } = require("react-router");
const { attemptLogin } = require("../dataHelper");

/**
 * Renders a button which displays a modal to allow a user to login.
 *
 * @param {object} props - Unused.
 */
function LoginModalButton(props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorText, setErrorText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorPopoverOpen, setIsErrorPopoverOpen] = useState(false);

    const doLogin = () => {
        setIsLoading(true);
        attemptLogin(username, password)
            .then((data) => {
                setCookies(data);
                navigate("/feed");
            })
            .catch((reason) => {
                setErrorText(reason.message)
                setIsErrorPopoverOpen(true);
                setIsLoading(false);
            });
    };

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Login
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
                                    placeholder="Enter your username..."
                                    label="Username"
                                    onValueChange={setUsername}
                                />
                                <Input
                                    type="password"
                                    labelPlacement="outside"
                                    placeholder="Enter your password..."
                                    label="Password"
                                    onValueChange={setPassword}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Popover
                                    color="danger"
                                    isOpen={isErrorPopoverOpen}
                                    onOpenChange={(open) => setIsErrorPopoverOpen(open)}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            color="primary"
                                            disabled={isLoading}
                                            isLoading={isLoading}
                                            onPress={doLogin}
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
                                                {errorText}<br />
                                                Check your username and password and try again.
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

module.exports = LoginModalButton;
