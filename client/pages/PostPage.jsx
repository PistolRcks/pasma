const React = require("react");
const { useState, useEffect } = require("react");
const { useParams, useNavigate } = require("react-router-dom");
const { useCookies } = require("react-cookie");
const {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Image,
    Skeleton,
} = require("@nextui-org/react");
const {
    ThumbsDown,
    ChatText,
    UserCircleGear,
    CurrencyCircleDollar,
    UserCircle,
    ArrowBendUpLeft,
} = require("@phosphor-icons/react");
const { Link } = require("react-router-dom");
const { getIndividualPost, flipDislike } = require("../dataHelper");
const ProfilePicture = require("../components/ProfilePicture");

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

    const [postData, setPostData] = useState({
        user: "John",
        userType: "Standard",
        timestamp: 1000000,
        picture: null,
        content:
            "This is a lot of text. This is a lot of text. This is a lot of text. This is a lot of text. This is a lot of text. This is a lot of text. This is a lot of text.",
        dislikes: 1000,
        comments: 1,
        isDisliked: false,
    });

    const [userTypeComponent, setUserTypeComponent] = useState(
        <div className="flex align-center ">
            <UserCircle size={32} />
            <p className="text-xl">User</p>
        </div>
    );
    const [commentComponents, setCommentComponents] = useState([]);

    const [isFetching, setIsFetching] = useState(true);
    const [isDislikedState, setIsDislikedState] = useState(
        !!postData.isDisliked
    );
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Disliking
    // Set 1 second debounce for when the dislike occurs
    useEffect(() => {
        // Ignore when we load
        if (!isFirstLoad && !isDebouncing) {
            setIsDebouncing(true);
            setTimeout(() => {
                flipDislike(cookies.token, id)
                    .catch((reason) => {
                        console.error(reason.message);
                    })
                    .finally(() => {
                        setIsDebouncing(false);
                    });
            }, 1000);
        }
    }, [isDislikedState]);

    useEffect(() => {
        setIsFirstLoad(false);
    }, []);

    // Load in data
    const loadData = () => {
        getIndividualPost(cookies.token, id).then((data) => {
            /**
                if (userType === "moderator") {
                    userTypeComponent = <UserCircleGear size={32} />;
                } else if (userType === "brand") {
                    userTypeComponent = <CurrencyCircleDollar size={32} />;
                } else {
                    userTypeComponent = (<UserCircle size={32} />);   
                }
                */
        });
        /*.catch((reason) => {
                setPosts([
                    <div key={0} className="grid grid-cols-1 gap-4">
                        <p>Failed to fetch posts. Reason:</p>
                        <p>{reason.message}</p>
                    </div>,
                ]);
                setIsFetching(false);
            });*/
    };

    useEffect(loadData, []);

    return (
        <div className="grid grid-cols-3 p-8 gap-4">
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
            <div className="grid grid-cols-1 gap-12 overflow-auto">
                {/* Hero post */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Header */}
                    <div className="flex gap-5 items-center">
                        <Link to={`/profile/${postData.user}`}>
                            <ProfilePicture
                                username={postData.user}
                                styling="w-20 h-20 text-large"
                            />
                        </Link>
                        <div className="flex grid grid-cols-1">
                            <Link to={`/profile/${postData.user}`}>
                                <p className="font-semibold text-xl">{`@${postData.user}`}</p>
                            </Link>
                            {userTypeComponent}
                            <p>
                                {new Date(postData.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="flex flex-col items-center">
                        <p className="text-xl">{postData.content}</p>
                        {postData.picture && postData.picture != "" && (
                            <Image
                                className=""
                                alt={`Picture for post ${id}`}
                                src={`/pictures/stock_images/${postData.picture}`}
                            />
                        )}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center place-content-between">
                        <p className="font-bold text-xl">{`${
                            postData.comments
                        } comment${postData.comments === 1 ? "" : "s"}`}</p>
                        <Button
                            variant={isDislikedState ? "solid" : "bordered"}
                            color={isDislikedState ? "danger" : "default"}
                            onPress={() => {
                                setIsDislikedState(!isDislikedState);
                            }}
                        >
                            <div className="flex gap-2">
                                <p>
                                    {postData.dislikes +
                                        (isDislikedState - postData.isDisliked)}
                                </p>
                                <ThumbsDown size={24} />
                            </div>
                        </Button>
                    </div>
                </div>
                {/* Other Posts */}
                {commentComponents}
            </div>
        </div>
    );
}

module.exports = PostPage;
