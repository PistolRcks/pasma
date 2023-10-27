const React = require('react')
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types')
const { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } = require("@nextui-org/react");
const { generatePassword } = require('../passwordGenerator.js');

function ChangePassword (props) {
    const { username } = props

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordsMatch, setNewPasswordsMatch] = useState(false);

    const handleSubmit = () => {
        console.log('Handle Submit Here')
        
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setNewPasswordsMatch(false);
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
                                    placeholder="Confirm New Password"
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
                                <Button
                                    isDisabled={!newPasswordsMatch}
                                    color="primary"
                                    onPress={() => {
                                        handleSubmit();
                                        onClose();
                                    }}
                                >
                                    Change Password
                                </Button>
                            </ModalFooter>  
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

module.exports = {
    ChangePassword
}

ChangePassword.propTypes = {
    username: PropTypes.string,
}

ChangePassword.defaultProps = {
    username: "alice"
}
