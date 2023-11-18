const React = require('react')
const { useNavigate } = require('react-router-dom')
const { Button, Card, CardBody, CardHeader, CardFooter, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, Textarea, Tooltip, useDisclosure } = require('@nextui-org/react')
const { ArrowBendUpLeft, PencilSimple, X } = require('@phosphor-icons/react')
const PostModalCard = require('./PostModalCard')
const ImageIcon = require('@phosphor-icons/react').Image // Alias for Phosphor Icons "Image", since it shares the same name as NextUI's "Image"

/**
 * Renders the create post form.
 * @param {object} props - Unused.
 */
function CreatePostForm (props) {
    const navigateTo = useNavigate()
    const [modalState, setModalState] = React.useState(true) //* true renders phrases, false renders photos
    const [phrase, setPhrase] = React.useState("")
    const [picture, setPicture] = React.useState(undefined)

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const imagePath = "pictures/stock_images/"

    const selectPhrase = (phraseString) => {
        setPhrase(phraseString)
        onOpenChange()
    }
    
    const selectPicture = (imageURL) => {
        setPicture(imageURL)
        onOpenChange()
    }

    const createPost = () => {
        // TODO: Create a post using the API
    }

    const stockPhrases = [ // TODO: Replace with actual phrases
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat diam ut venenatis tellus in.",
        "Ut ornare lectus sit amet est. Sed velit dignissim sodales ut eu sem integer.",
        "Libero id faucibus nisl tincidunt eget nullam. Ante in nibh mauris cursus mattis molestie a. Velit sed ullamcorper morbi tincidunt. Adipiscing at in tellus integer feugiat scelerisque varius morbi. Sagittis id consectetur purus ut faucibus. In nulla posuere sollicitudin aliquam.",
        "Aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Quam quisque id diam vel quam.",
        "Nibh cras pulvinar mattis nunc sed blandit libero volutpat sed. Amet nisl purus in mollis nunc. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Blandit libero volutpat sed cras ornare arcu dui vivamus. Lorem ipsum dolor sit amet. Egestas erat imperdiet sed euismod nisi porta lorem mollis. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. Non consectetur a erat nam at lectus urna. Donec enim diam vulputate ut pharetra sit.",
        "Turpis egestas sed tempus urna et pharetra. Est ante in nibh mauris. Donec adipiscing tristique risus nec feugiat in. Hac habitasse platea dictumst vestibulum rhoncus est. Sem nulla pharetra diam sit amet nisl suscipit.",
        "Morbi non arcu risus quis. Eleifend quam adipiscing vitae proin sagittis nisl."
    ]
    const stockImages = [ // TODO: Replace with actual image URLs
        "stockImage001.png",
        "stockImage002.png",
        "stockImage003.png",
        "stockImage004.png",
        "stockImage005.png",
        "stockImage006.png",
        "stockImage007.png",
        "stockImage008.png",
        "stockImage009.png",
        "stockImage010.png",
        "stockImage011.png",
        "stockImage012.png"
    ]

    return (
        <div className="grid justify-items-center mt-6">
            <Card className="flex-auto w-1/2">
                <CardHeader>
                    <Button size="sm" radius="full" startContent={<ArrowBendUpLeft className="h-4 w-4"/>} onClick={() => {
                        navigateTo("/feed")
                    }}>
                        Back to Post Feed
                    </Button>
                </CardHeader>
                <CardBody>
                    <Textarea
                        isReadOnly 
                        className="cursor-pointer"
                        minRows={8}
                        size="lg"
                        radius="none"
                        value={phrase}
                        placeholder="Propagate passive aggression responsibly!"
                        description="Click the field above to select a predefined phrase for your post."
                        onClick={async () => {
                            await setModalState(true)
                            onOpen()
                        }}
                    />
                </CardBody>
                <CardFooter className="flex justify-between items-end">
                    <div className="grid gap-x-0.5 grid-cols-2">
                        {picture ?
                            <Image className="cursor-pointer h-16 w-16" src={imagePath + picture} onClick={() => {
                                setModalState(false)
                                onOpen()
                            }}/>
                            :
                            <></>
                        }
                        <Tooltip placement={picture ? "right" : "top"} content={picture ? "Remove Picture" : "Attach Picture"}>
                            <Button
                                isIconOnly
                                size={picture ? "sm" : "md"}
                                radius="full"
                                onPress={async () => {
                                    if(picture) {
                                        setPicture(undefined)
                                    } else {
                                        await setModalState(false)
                                        onOpen()
                                    }
                                }}
                            >
                                {picture ? <X className="h-4 w-4"/> : <ImageIcon className="h-6 w-6"/>}
                            </Button>
                        </Tooltip>
                    </div>
                    <Button
                        isDisabled={phrase == ""}
                        color={phrase == "" ? "default" : "primary"}
                        radius="full"
                        endContent={<PencilSimple className="h-6 w-6"/>}
                        onClick={() => {

                        }}
                    >Create Post</Button>
                </CardFooter>
            </Card>
            <Modal size="2xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>
                        {modalState ? <p>Select a Phrase</p> : <p>Select a Photo</p>}
                    </ModalHeader>
                    <ModalBody>
                        {modalState ?
                            <div className="columns-2">
                                {stockPhrases.map((item, index) => (
                                    <PostModalCard key={item} phraseString={item} sendProperty={selectPhrase}/>
                                ))}
                            </div>
                            :
                            <div className="columns-3">
                                {stockImages.map((item, index) => (
                                    <PostModalCard key={item} imageURL={item} sendProperty={selectPicture}/>
                                ))}
                            </div>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

module.exports = CreatePostForm
