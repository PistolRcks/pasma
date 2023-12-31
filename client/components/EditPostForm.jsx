const React = require('react')
const { useParams, useNavigate } = require('react-router-dom')
const { useCookies } = require('react-cookie')
const { Button, Card, CardBody, CardHeader, CardFooter, Image, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Textarea, Tooltip, useDisclosure } = require('@nextui-org/react')
const { ArrowBendUpLeft, PencilSimple, X } = require('@phosphor-icons/react')
const PostModalCard = require('./PostModalCard')
const ImageIcon = require('@phosphor-icons/react').Image // Alias for Phosphor Icons "Image", since it shares the same name as NextUI's "Image"
const { sendEditPost, getIndividualPost, getAllPhrases, getAllStockImages } = require('../dataHelper.js')

/**
 * Renders the create post form.
 * @param {object} props - Unused.
 */
function EditPostForm (props) {
    const { id } = useParams();
    const navigateTo = useNavigate()
    const [cookies] = useCookies(["token"])
    const [modalState, setModalState] = React.useState(true) //* true renders phrases, false renders photos
    const [isFormDisabled, setIsFormDisabled] = React.useState(false)
    const [phrase, setPhrase] = React.useState(undefined)
    const [picture, setPicture] = React.useState(null)
    const [stockPhrases, setStockPhrases] = React.useState([])
    const [stockImages, setStockImages] = React.useState([])

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const imagePath = "/pictures/stock_images/"

    const selectPhrase = (phraseString) => {
        setPhrase(phraseString)
        onOpenChange()
    }
    
    const selectPicture = (imageURL) => {
        setPicture(imageURL)
        onOpenChange()
    }

    // get the post data and autopopulate the form
    React.useEffect(() => {
        onStart();
    }, []);

    async function onStart() {
        await getIndividualPost(cookies.token, id).then((postData) => {
            setPhrase(postData[0].content);
            setPicture(postData[0].picture);
        })
        await getAllStockImages(cookies.token).then((imageData) => {
            setStockImages(imageData);
        })
    }

    return (
        <div className="grid justify-items-center mt-6">
            <Card className="flex-auto w-1/2">
                <CardHeader>
                    <Button
                        isDisabled={isFormDisabled}
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
                    <Textarea
                        isReadOnly
                        isDisabled={isFormDisabled}
                        className="cursor-pointer"
                        minRows={8}
                        size="lg"
                        radius="none"
                        value={phrase}
                        defaultValue={phrase}
                        description="Click the field above to select a predefined phrase for your post."
                        onClick={async () => {
                            if(!isFormDisabled) {
                                if(stockPhrases.length == 0) {
                                    setStockPhrases(await getAllPhrases(cookies.token))
                                }
                                setModalState(true)
                                onOpen()
                            }
                        }}
                    />
                </CardBody>
                <CardFooter className="flex justify-between items-end">
                    <div className="grid gap-x-0.5 grid-cols-2">
                        {picture ?
                            <Image isZoomed className="cursor-pointer h-16 w-16" src={imagePath + picture} onClick={async () => {
                                setModalState(false)
                                onOpen()
                            }}/>
                            :
                            <></>
                        }
                        <Tooltip placement={picture ? "right" : "top"} content={picture ? "Remove Picture" : "Attach Picture"}>
                            <Button
                                isIconOnly
                                isDisabled={isFormDisabled}
                                size={picture ? "sm" : "md"}
                                radius="full"
                                onPress={async () => {
                                    if(picture) {
                                        setPicture(null)
                                    } else {
                                        setModalState(false)
                                        onOpen()
                                    }
                                }}
                            >
                                {picture ? <X className="h-4 w-4"/> : <ImageIcon className="h-6 w-6"/>}
                            </Button>
                        </Tooltip>
                    </div>
                    <Button
                        isDisabled={(!phrase || isFormDisabled) && !(phrase && !isFormDisabled)} //* XOR
                        isLoading={isFormDisabled}
                        color={phrase ? "primary" : "default"}
                        radius="full"
                        endContent={<PencilSimple className="h-6 w-6"/>}
                        onClick={async () => {
                            setIsFormDisabled(true)
                            await sendEditPost(cookies.token, id, phrase).catch((reason) => {
                                window.alert("Error editing post. Reason: " + reason.message)
                            })
                            navigateTo("/feed")
                        }}
                    >Save</Button>
                </CardFooter>
            </Card>
            <Modal size="2xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>
                        {modalState ? <p>Select a Phrase</p> : <p>Select a Photo</p>}
                    </ModalHeader>
                    <ModalBody>
                        {modalState ?
                            stockPhrases.length > 0 ?
                                <div className="columns-2">
                                    {stockPhrases.map((item, index) => (
                                        <PostModalCard key={item} phraseString={item} sendProperty={selectPhrase}/>
                                    ))}
                                </div>
                                :
                                <Spinner className="pb-4" label="Loading phrases..." size="lg" color="warning" />
                            :
                            stockImages.length > 0 ?
                                <div className="columns-3">
                                    {stockImages.map((item, index) => (
                                        <PostModalCard key={item} imageURL={item} sendProperty={selectPicture}/>
                                    ))}
                                </div>
                                :
                                <Spinner className="pb-4" label="Loading images..." size="lg" color="warning" />
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

module.exports = EditPostForm
