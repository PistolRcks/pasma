const React = require("react");
const LoginModalButton = require("../components/LoginModalButton")

/**
 * Renders the index page (the landing page) for the website.
 * @param {object} props - Unused.
 */
function IndexPage(props) {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div className="h-56 grid grid-cols-1 gap-2">
                <p>This page is "/" (the index page).</p>
                <LoginModalButton />
            </div>
        </div>
    );
}

module.exports = IndexPage;
