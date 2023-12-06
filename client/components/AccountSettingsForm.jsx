const React = require('react')
const { useNavigate } = require('react-router-dom')
const { useCookies } = require('react-cookie')
const { Button, Card, CardBody, CardHeader, CardFooter, Image, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Textarea, Tooltip, useDisclosure } = require('@nextui-org/react')
const { ArrowBendUpLeft, PencilSimple, X } = require('@phosphor-icons/react')
const ChangePassword = require('./ChangePassword.jsx')

/**
 * Renders the account settings form.
 * @param {object} props - Unused.
 */
function AccountSettingsForm (props) {
    const navigateTo = useNavigate()
    const [cookies] = useCookies(["token", "username"])
    // const [modalState, setModalState] = React.useState(true) //* true renders phrases, false renders photos

    // const {isOpen, onOpen, onOpenChange} = useDisclosure()

    return (
        <div className="grid justify-items-center mt-6">
            <Card className="flex-auto w-1/2">
                <CardHeader>
                    <Button
                        size="sm"
                        radius="full"
                        startContent={<ArrowBendUpLeft size={16}/>}
                        onClick={() => {
                            navigateTo("/feed")
                        }}
                    >
                        Back to Feed
                    </Button>
                </CardHeader>
                <CardBody>
                    <ChangePassword username={cookies.username} />
                </CardBody>
                <CardFooter className="flex justify-between items-end">
                    
                    

                    <Button
                        size="sm"
                        radius="full"
                        color="error"
                        onClick={() => {
                            navigateTo("/feed")
                        }}
                    >Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

module.exports = AccountSettingsForm
