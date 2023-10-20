const React = require('react')
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types')
const { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } = require("@nextui-org/react");

function ChangePassword (props) {
    const { username } = props
    // const [visible, setVisible] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // const handleClose = () => setVisible(false);
    // const handleOpen = () => setVisible(true);

    const handleSubmit = () => {
        console.log('Handle Submit Here')
    };

    return (
        <>
            <Button onPress={onOpen}>Change Password</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                {/*
                                <Input.Password
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <Input.Password
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Input.Password
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                */}
                                <p> 
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>  
                        </>
                    )}
                </ModalContent>
                {/*
                <Modal.Action passive onClick={() => setVisible(false)}>
                    Cancel
                </Modal.Action>
                <Modal.Action onClick={handleSubmit}>Submit</Modal.Action>
                    */}
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
