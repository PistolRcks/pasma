const React = require("react");
const { useState, useEffect } = require("react");
const { useParams, useNavigate } = require("react-router-dom");
const { useCookies } = require("react-cookie");
const { Button, Skeleton, Spinner } = require("@nextui-org/react");
const { ArrowBendUpLeft } = require("@phosphor-icons/react");
const { getIndividualPost } = require("../dataHelper");
const PostCard = require("../components/PostCard");
const HeroPostCard = require("../components/HeroPostCard");

/**
 * Renders the individual post page.
 *
 * The route returns the param of 'id', which is the id of the post
 * to read.
 * @param {object} props - Unused.
 */
function PostPage(props) {
    const { id } = useParams();
    const [cookies, setCookies] = useCookies(["token"]);
    const navigate = useNavigate();

    const [heroPostComponent, setHeroPostComponent] = useState(<></>);
    const [commentComponents, setCommentComponents] = useState([]);

    const [isFetching, setIsFetching] = useState(true);

    // Load in data
    const loadData = () => {
        setIsFetching(true);
        getIndividualPost(cookies.token, id)
            .then((data) => {
                let commentComps = [];
                data.forEach((post) => {
                    const {
                        user,
                        userType,
                        timestamp,
                        picture,
                        content,
                        dislikes,
                        comments,
                        isDisliked,
                    } = post;

                    if (post.id === id) {
                        setHeroPostComponent(
                            <HeroPostCard
                                id={post.id}
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
                    } else {
                        commentComps.push(
                            <PostCard
                                key={post.id}
                                id={post.id}
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
                    }
                });
                
                // If we don't get any comments, put some text there
                if (commentComps.length == !"0") {
                    commentComps = (
                        <p className="text-xl font-bold flex justify-self-center">No Comments</p>
                    )
                }

                setCommentComponents(commentComps);
                setIsFetching(false);
            })
            .catch((reason) => {
                setHeroPostComponent([
                    <div key={0} className="grid grid-cols-1 gap-4">
                        <p>Failed to fetch posts. Reason:</p>
                        <p>{reason.message}</p>
                    </div>,
                ]);
                setIsFetching(false);
            });
    };

    useEffect(loadData, []);

    return (
        <>
            {isFetching ? (
                <Spinner className="fixed mx-auto inset-0" label="Loading Posts..." color="primary" />
            ) : (
                <div className="grid grid-cols-3 p-8 gap-8">
                    {/* Back to feed button */}
                    <Button
                        radius="full"
                        className="justify-self-end"
                        onClick={() => {
                            navigate("/feed");
                        }}
                    >
                        <ArrowBendUpLeft size={16} />
                        <p>Back to Feed</p>
                    </Button>
                    {/* Post and comments */}
                    <div className="grid grid-cols-1 gap-8">
                        {heroPostComponent}
                        {commentComponents}
                        <div className={cookies.darkMode ? "dark text-foreground bg-background h-screen" : ""}></div>
                    </div>
                </div>
            )}
        </>
    );
}

module.exports = PostPage;
