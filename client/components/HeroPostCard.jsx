const React = require("react");
const { useState, useEffect } = require("react");
const { Button, Image } = require("@nextui-org/react");
const {
    ThumbsDown,
    UserCircleGear,
    CurrencyCircleDollar,
    UserCircle,
} = require("@phosphor-icons/react");
const PropTypes = require("prop-types");
const { Link } = require("react-router-dom");
const { flipDislike } = require("../dataHelper");
const ProfilePicture = require("../components/ProfilePicture");

/**
 * Renders the "Hero Post" (the post at the top of the PostPage).
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
function HeroPostCard(props) {
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

    let userTypeComponent;
    if (userType === "moderator") {
        userTypeComponent = (
            <div className="flex align-center">
                <UserCircleGear size={32} />
                <p className="text-xl">Moderator</p>
            </div>
        );
    } else if (userType === "brand") {
        userTypeComponent = (
            <div className="flex align-center">
                <CurrencyCircleDollar size={32} />
                <p className="text-xl">Brand</p>
            </div>
        );
    } else {
        userTypeComponent = (
            <div className="flex align-center">
                <UserCircle size={32} />
                <p className="text-xl">User</p>
            </div>
        );
    }

    const [isDislikedState, setIsDislikedState] = useState(!!isDisliked);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Disliking
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
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Header */}
            <div className="flex gap-5 items-center">
                <Link to={`/profile/${username}`}>
                    <ProfilePicture
                        username={username}
                        styling="w-20 h-20 text-large"
                    />
                </Link>
                <div className="flex grid grid-cols-1">
                    <Link to={`/profile/${username}`}>
                        <p className="font-semibold text-xl">{`@${username}`}</p>
                    </Link>
                    {userTypeComponent}
                    <p>{new Date(timestamp).toLocaleString()}</p>
                </div>
            </div>
            {/* Body */}
            <div className="grid grid-cols-1 justify-items-center gap-4">
                <p className="text-xl justify-self-start">{content}</p>
                {picture && picture != "" && (
                    <Image
                        alt={`Picture for post ${id}`}
                        src={`/pictures/stock_images/${picture}`}
                    />
                )}
            </div>
            {/* Footer */}
            <div className="flex items-center place-content-between">
                <p className="font-bold text-xl">{`${numComments} comment${
                    numComments === 1 ? "" : "s"
                }`}</p>
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
            </div>
        </div>
    );
}

module.exports = HeroPostCard;

HeroPostCard.propTypes = {
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

HeroPostCard.defaultProps = {
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
