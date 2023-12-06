const React = require('react')
const { useNavigate } = require('react-router-dom')
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types');
const { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Popover, PopoverTrigger, PopoverContent, useDisclosure } = require("@nextui-org/react");
const { generatePassword } = require('../passwordGenerator.js');
const { sendUpdatedPassword } = require('../dataHelper.js');
const { useCookies } = require('react-cookie');

function ChangePassword (props) {
    const { username } = props

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordsMatch, setNewPasswordsMatch] = useState(false);

    const [errorText, setErrorText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorPopoverOpen, setIsErrorPopoverOpen] = useState(false);
    const navigate = useNavigate();

    // May not need this....
    // const passwordRef = useRef(null);

    // Set the cookie name that holds the session cookie
    const [cookie, setCookie] = useCookies(['token']);

    /*
    const handleSubmit = () => {
        const passwordResponse = sendUpdatedPassword(cookie.token, oldPassword, newPassword)
        if (passwordResponse == "OK") {
            alert("Password Updated!")

            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setNewPasswordsMatch(false);
        } else {
            alert(`Password Update Failed!`)
        }
    };
    */

    const handleSubmit = () => {
        setIsLoading(true);
        sendUpdatedPassword(cookie.token, oldPassword, newPassword)
            .then((data) => {
                if (data == "OK") {
                    alert("Password Updated!")
        
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setNewPasswordsMatch(false);
                } else {
                    setIsErrorPopoverOpen(true);
                    setIsLoading(false);
                }

                // nativate to login page
                navigate("/");
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
            <Button onPress={onOpen}>Change Password</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Change your Password</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Old Password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value)
                                    }}
                                />
                                <Button
                                    color="primary"
                                    onPress={() => {   
                                        const temp = generatePassword(3)
                                        setNewPassword(temp)
                                    }}
                                >
                                    Generate New Password
                                </Button>
                                <Input
                                    label="New Password"
                                    isReadOnly
                                    value={newPassword}
                                />
                                <Input
                                    isDisabled={newPassword === '' || oldPassword === ''}
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={confirmNewPassword}
                                    color={newPasswordsMatch ? 'success' : 'danger' }
                                    onChange={(e) => {
                                        setConfirmNewPassword(e.target.value)
                                        if (newPassword === e.target.value) {
                                            setNewPasswordsMatch(true)
                                        } else {
                                            setNewPasswordsMatch(false)
                                        }
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
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
                                            title="changePasswordButton"
                                            color="primary"
                                            disabled={isLoading}
                                            isDisabled={!newPasswordsMatch || !cookie.token}
                                            isLoading={isLoading}
                                            onPress={handleSubmit}
                                            radius="full"
                                        >
                                            Change Password
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
};

module.exports = ChangePassword

ChangePassword.propTypes = {
    username: PropTypes.string,
}

ChangePassword.defaultProps = {
    username: "alice"
}
