const React = require("react");
const { useDisclosure } = require("@nextui-org/react")
const { Image, Card, CardBody, Button } = require("@nextui-org/react");
const LoginModalButton = require("../components/LoginModalButton");
const AccountCreationCard = require("../components/AccountCreationCard");

/**
 * Renders the index page (the landing page) for the website.
 * @param {object} props - Unused.
 */
function IndexPage(props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className="bg-[url('/pictures/bgs/landing_bg.svg')] bg-cover bg-center">
            <div className="h-screen grid grid-cols-2 place-content-around justify-items-center">
                <div className="grid grid-cols-1 content-center px-16 -mt-20 gap-6">
                    <Image src="/pictures/logos/pasmaBanner.png" />
                    <div className="grid grid-cols-1 gap-6">
                        <p className="text-6xl font-semibold text-white">Welcome to pasma.</p>
                        <p className="text-4xl italic text-white">"Straining relationships since 2023."</p>
                    </div>
                </div>
                <Card>
                    <CardBody>
                        <div className="grid grid-cols-1 gap-16 p-12">
                            <div className="justify-center grid grid-cols-1 gap-4">
                                <p className="font-semibold text-2xl">New to pasma?</p>
                                <Button radius="full" color="primary" size="lg" onClick={onOpen}>
                                    Create Account
                                </Button>
                                <AccountCreationCard isOpen={isOpen} onOpenChange={onOpenChange} />
                            </div>
                            <div className="justify-center grid grid-cols-1 gap-4">
                                <p className="font-semibold text-2xl">Returning user?</p>
                                <LoginModalButton size="lg"/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

module.exports = IndexPage;
