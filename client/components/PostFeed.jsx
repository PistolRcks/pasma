const { Button, Spinner } = require("@nextui-org/react");
const React = require("react");
const { useEffect, useState } = require("react");
const PropTypes = require("prop-types");
const { retrievePostFeedData } = require("../dataHelper");
const PostCard = require("./PostCard");

/**
 * Renders the feed of posts via multiple PostCard objects.
 *
 * @param {object} props - Must contain the "token" which is the token for a currently logged in user.
 */
function PostFeed(props) {
    const { token } = props;
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const fetchPosts = () => {
        // Set spinner while loading
        setIsFetching(true);
        setPosts(<Spinner label="Loading Posts..." color="Primary" />);

        // Load data
        retrievePostFeedData(token)
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
                    } = postData;
                    postComponents.push(
                        <PostCard
                            key={i}
                            id={id}
                            username={user}
                            timestamp={timestamp}
                            content={content}
                            numDislikes={dislikes}
                            numComments={comments}
                            picture={picture}
                            userType={userType}
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

    return (
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
    );
}

module.exports = PostFeed;

PostFeed.propTypes = {
    token: PropTypes.string.isRequired,
};
