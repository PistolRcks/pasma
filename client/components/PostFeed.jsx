const { Button } = require("@nextui-org/react");
const React = require("react");
const { useEffect, useState } = require("react");
const PropTypes = require('prop-types')
const { retrievePostFeedData } = require("../dataHelper");

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
        retrievePostFeedData(token)
            .then((data) => {
                let postComponents = [];
                data.forEach((postData, i) => {
                    postComponents.push(
                        <p key={i}>{`This is ${postData.id}`}</p>
                    )
                });
                setPosts(postComponents);
            })
            .catch((reason) => {
                setPosts([
                    <div key={0} className="grid grid-cols-1 gap-4">
                        <p>Failed to fetch posts. Reason:</p>
                        <p>{reason.message}</p>
                    </div>
                ])
            });
    }

    useEffect(fetchPosts, []);

    return (
        <div className="w-1/2 grid-cols-1 gap-4 justify-center justify-items-center">
            {posts}
            <Button 
                color="primary" variant="bordered"
                disabled={isFetching}
                onPress={(e) => {
                    fetchPosts();
                }}
            >Load More</Button>
        </div>
    )
}

module.exports = PostFeed;

PostFeed.propTypes = {
    token: PropTypes.string.isRequired,
}
