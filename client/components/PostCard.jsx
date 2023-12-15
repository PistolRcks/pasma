const {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Image,
    Tooltip,
} = require("@nextui-org/react");
const React = require("react");
const { useState, useEffect } = require("react");
const PropTypes = require("prop-types");
const ProfilePicture = require("../components/ProfilePicture");
const {
    ThumbsDown,
    ChatText,
    UserCircleGear,
    CurrencyCircleDollar,
    PencilSimple,
} = require("@phosphor-icons/react");
const { Link } = require("react-router-dom");
const { flipDislike } = require("../dataHelper");
const { useCookies } = require("react-cookie")

/**
 * Generates a Card representing a Post.
 * @param {object} props - Has the following:
 *  - token (session token for the user)
 *  - id (id of the post)
 *  - username
 *  - userType
 *  - timestamp
 *  - content
 *  - picture
 *  - numComments
 *  - numDislikes
 *  - isDisliked
 */
function PostCard(props) {
    const {
        token,
        id,
        username,
        userType,
        timestamp,
        content,
        picture,
        numComments,
        numDislikes,
        isDisliked,
    } = props;
    const [isDislikedState, setIsDislikedState] = useState(!!isDisliked);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [cookies] = useCookies(["username"]);

    // Set 1 second debounce for when the dislike occurs
    useEffect(() => {
        // Ignore when we load
        if (!isFirstLoad && !isDebouncing) {
            setIsDebouncing(true);
            setTimeout(() => {
                flipDislike(token, id)
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
    }, [])
    

    let userTypeComponent = <></>;
    if (userType === "moderator") {
        userTypeComponent = <UserCircleGear size={16} />;
    } else if (userType === "brand") {
        userTypeComponent = <CurrencyCircleDollar size={16} />;
    }

    return (
        <Card>
            <CardHeader className="justify-between">
                <div className="flex gap-5 items-center">
                    <Link to={`/profile/${username}`}>
                        <ProfilePicture username={username} size="lg" />
                    </Link>
                    <div className="flex flex-col items-start">
                        <Link to={`/profile/${username}`}>
                            <div className="flex gap-1 items-center">
                                <p className="font-semibold">{`@${username}`}</p>
                                {userTypeComponent}
                            </div>
                        </Link>
                        <p>{new Date(timestamp).toLocaleString()}</p>
                    </div>
                </div>
                {username == cookies.username ? (
                    <Tooltip placement="top" content="Edit Post">
                        <Button variant="bordered">
                            <Link to={`/edit/${id}`}>
                                <PencilSimple size={24} />
                            </Link>
                        </Button>
                    </Tooltip>
                ) : (
                    <></>
                )}
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 justify-items-center gap-4">
                    <p className="text-xl justify-self-start">{content}</p>
                    {picture && picture != "" && (
                        <Image
                            alt={`Picture for post ${id}`}
                            src={`/pictures/stock_images/${picture}`}
                        />
                    )}
                </div>
            </CardBody>
            <CardFooter className="place-content-between">
                <Link to={`/post/${id}`}>
                    <Button variant="bordered">
                        <div className="flex gap-2">
                            <ChatText size={24} />
                            <p>{numComments}</p>
                        </div>
                    </Button>
                </Link>
                <Button
                    variant={isDislikedState ? "solid" : "bordered"}
                    color={isDislikedState ? "danger" : "default"}
                    onPress={() => {
                        setIsDislikedState(!isDislikedState);
                    }}
                >
                    <div className="flex gap-2">
                        <p>{numDislikes + (isDislikedState - isDisliked)}</p>
                        <ThumbsDown size={24} />
                    </div>
                </Button>
            </CardFooter>
        </Card>
    );
}

module.exports = PostCard;

PostCard.propTypes = {
    token: PropTypes.string,
    id: PropTypes.string,
    username: PropTypes.string,
    userType: PropTypes.string,
    timestamp: PropTypes.number,
    content: PropTypes.string,
    picture: PropTypes.string,
    numComments: PropTypes.number,
    numDislikes: PropTypes.number,
    isDisliked: PropTypes.number,
};

PostCard.defaultProps = {
    token: "",
    id: 0,
    username: "<No User>",
    userType: "standard",
    timestamp: 0,
    content: "",
    picture: null,
    numComments: 0,
    numDislikes: 0,
    isDisliked: 0,
};
