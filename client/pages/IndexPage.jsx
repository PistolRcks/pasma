const React = require("react");
const AccountCreationCard = require("../Components/AccountCreationCard");
const { Button } = require("@nextui-org/react");
const { useDisclosure } = require("@nextui-org/react")

/**
 * Renders the index page (the landing page) for the website.
 * @param {object} props - Unused.
 */
function IndexPage(props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <React.Fragment>
            <p>This page is "/" (the index page).</p>
            <Button onClick={onOpen}>Create Account Card</Button>
            <AccountCreationCard isOpen={isOpen} onOpenChange={onOpenChange}/>
        </React.Fragment>
    );
}

module.exports = IndexPage;
