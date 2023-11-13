const React = require("react");
const { Button } = require("@nextui-org/button");
const { Link } = require("react-router-dom");
const { useCookies } = require("react-cookie");
const PostFeed = require("../components/PostFeed");

/**
 * Renders the post feed page.
 * @param {object} props - Unused.
 */
function PostFeedPage(props) {
    const [cookies, setCookie, removeCookie] = useCookies();

    if (!("token" in cookies)) {
        return (
            <>
                <p>What are you doing here when you're not logged in?</p>
                <br />
                <Button color="primary">
                    <Link to={"/"}>Click here to return to the homepage.</Link>
                </Button>
            </>
        );
    } else {
        return (
            <div className="flex items-center justify-center p-8">
                <PostFeed token={cookies.token} />
            </div>
        );
    }
}

module.exports = PostFeedPage;
