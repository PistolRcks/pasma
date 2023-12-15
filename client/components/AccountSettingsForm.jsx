const React = require('react')
const { useNavigate } = require('react-router-dom')
const { useCookies } = require('react-cookie')
const { Button, Card, CardBody, CardHeader, CardFooter, Image, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Textarea, Tooltip, Popover, PopoverTrigger, PopoverContent, Skeleton, Input, useDisclosure } = require('@nextui-org/react')
const { ArrowBendUpLeft, PencilSimple, X } = require('@phosphor-icons/react')
const ChangePassword = require('./ChangePassword.jsx')
const { getAllProfilePictures } = require('../dataHelper.js')

/**
 * Renders the account settings form.
 * @param {object} props - Unused.
 */
function AccountSettingsForm (props) {
    const navigateTo = useNavigate()
    const [cookies] = useCookies(["token", "username", "profilePicture"])
    const [profilePictures, setProfilePictures] = React.useState([]);
    const [profilePicture, setProfilePicture] = React.useState("botttsNeutral-1695826814739.png")
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    // const [modalState, setModalState] = React.useState(true) //* true renders phrases, false renders photos

    // const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const imagePath = "pictures/profile_pictures/"

    React.useEffect(() => {
        onStart()
    }, [])
    async function onStart() {
        // Set default profile picture
        setProfilePicture(cookies.profilePicture)
        // Make list of profile pictures
        setProfilePictures(await getAllProfilePictures())
    }

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
                <CardBody className="grid grid-flow-col auto-cols-max">
                    <div className="pl-2 pr-6 w-48">
                        <Popover showArrow isOpen={isPopoverOpen} onOpenChange={(open) => setIsPopoverOpen(open)} placement="right">
                            <PopoverTrigger>
                                <Skeleton className="rounded-full" isLoaded={profilePictures.length > 0}>
                                    <Image className="cursor-pointer" src={imagePath + profilePicture} width={180} radius="full" />
                                </Skeleton>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 max-h-80">
                                    {profilePictures.length > 0 ?
                                        <div className="grid grid-cols-3 gap-4 py-3 pr-4 overflow-y-scroll">
                                            {profilePictures.map((item, index) => (
                                                <Image key={item} onClick={() => {
                                                        setProfilePicture(item)
                                                        setIsPopoverOpen(false)
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
                            readOnly
                            className="pt-2"
                            label="Username"
                            labelPlacement="outside"
                            size="lg"
                            placeholder={cookies.username}
                            defaultValue={cookies.username}
                        />
                        <br />
                        <ChangePassword username={cookies.username} />
                    </div>
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
