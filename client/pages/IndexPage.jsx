const React = require("react");
const AccountCreationCard = require("../components/AccountCreationCard");
const { Button } = require("@nextui-org/react");
const { useDisclosure } = require("@nextui-org/react")
const LoginModalButton = require("../components/LoginModalButton");

/**
 * Renders the index page (the landing page) for the website.
 * @param {object} props - Unused.
 */
function IndexPage(props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-56 grid grid-cols-1 gap-2">
                <p>This page is "/" (the index page).</p>
				<Button onClick={onOpen}>Create Account Card</Button>
                <AccountCreationCard isOpen={isOpen} onOpenChange={onOpenChange}></AccountCreationCard>
                <LoginModalButton />
            </div>
        </div>
    );
}

module.exports = IndexPage;
