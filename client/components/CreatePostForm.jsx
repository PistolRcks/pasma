const React = require('react')
const { useNavigate } = require('react-router-dom')
const { Button, Card, CardBody, CardHeader, CardFooter, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } = require('@nextui-org/react')
const { ArrowBendUpLeft, PencilSimple } = require('@phosphor-icons/react')

function CreatePostForm (props) {
    const navigateTo = useNavigate()

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    return (
        <div className="grid justify-items-center mt-6">
            <Card className="flex-auto w-2/3">
                <CardHeader>
                    <Button size="sm" radius="full" startContent={<ArrowBendUpLeft className="h-4 w-4"/>} onClick={() => {
                        navigateTo("/") // TODO: Change to correct route when post feed is implemented
                    }}>
                        Back to Post Feed
                    </Button>
                </CardHeader>
                <CardBody>
                    <Textarea isReadOnly minRows={8} size="lg" radius="none" placeholder="Click here to select a predefined phrase to post." onClick={onOpen}/>
                </CardBody>
                <CardFooter className="grid justify-items-end">
                    <Button color="primary" radius="full" endContent={<PencilSimple className="h-6 w-6"/>}>Create Post</Button>
                </CardFooter>
            </Card>
            <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>
                        { /* TODO: Add search bar and close button */ }
                        <p>Select a Phrase</p>
                    </ModalHeader>
                    <ModalBody>
                        { /* TODO: Add grid with phrase cards */ }
                        <div className="columns-3"><p>PHRASES WILL GO HERE</p></div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

module.exports = CreatePostForm
