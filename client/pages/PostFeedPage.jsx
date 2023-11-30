const React = require("react");
const { useState, useEffect } = require("react");
const { Button, Spinner } = require("@nextui-org/react");
const { Link } = require("react-router-dom");
const { useCookies } = require("react-cookie");
const { retrievePostFeedData } = require("../dataHelper");
const PostCard = require("../components/PostCard");

/**
 * Renders the post feed page.
 * @param {object} props - Unused.
 */
function PostFeedPage(props) {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isFetching, setIsFetching] = useState(false);
    const [posts, setPosts] = useState([]);
    
    const fetchPosts = () => {
        // Set spinner
        setPosts(<Spinner label="Loading Posts..." color="Primary" />);
        setIsFetching(true);

        // Load data
        retrievePostFeedData(cookies.token)
            .then((data) => {
                let postComponents = [];
                data.forEach((postData, i) => {
                    const {
                        id,
                        user,
                        userType,
                        timestamp,
                        picture,
                        content,
                        dislikes,
                        comments,
                        isDisliked,
                    } = postData;
                    postComponents.push(
                        <PostCard
                            key={i}
                            id={id}
                            token={cookies.token}
                            username={user}
                            timestamp={timestamp}
                            content={content}
                            numDislikes={dislikes}
                            numComments={comments}
                            picture={picture}
                            userType={userType}
                            isDisliked={isDisliked}
                        />
                    );
                });
                setPosts(postComponents);
                setIsFetching(false);
            })
            .catch((reason) => {
                setPosts([
                    <div key={0} className="grid grid-cols-1 gap-4">
                        <p>Failed to fetch posts. Reason:</p>
                        <p>{reason.message}</p>
                    </div>,
                ]);
                setIsFetching(false);
            });
    };

    useEffect(fetchPosts, []);

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
                <div className="w-1/2 grid grid-cols-1 gap-12 justify-stretch">
                    {posts}
                    {!isFetching && <Button
                        className="justify-self-center"
                        color="primary"
                        variant="bordered"
                        disabled={isFetching}
                        onPress={(e) => {
                            fetchPosts();
                        }}
                    >
                        Reload Posts
                    </Button>}
                </div>
            </div>
        );
    }
}

module.exports = PostFeedPage;
