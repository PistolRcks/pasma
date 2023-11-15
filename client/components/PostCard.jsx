const { Card, CardHeader, CardBody, CardFooter, Button, Image } = require("@nextui-org/react");
const React = require("react");
const PropTypes = require('prop-types');
const ProfilePicture = require("../components/ProfilePicture");
const { ThumbsDown, ChatText, UserCircleGear, CurrencyCircleDollar } = require("@phosphor-icons/react");
const { Link } = require("react-router-dom");

/**
 * Generates a Card representing a Post.
 * @param {object} props - Has the following:
 *  - id
 *  - username
 *  - userType
 *  - timestamp
 *  - content
 *  - picture
 *  - numComments
 *  - numDislikes
 */
function PostCard(props) {
    const { id, username, userType, timestamp, content, picture, numComments, numDislikes } = props

    let userTypeComponent = (<></>);
    if (userType === "moderator") {
        userTypeComponent = (<UserCircleGear size={16} />);
    } else if (userType === "brand") {
        userTypeComponent = (<CurrencyCircleDollar size={16} />);
    }
    
    return (
        <Card>
            <CardHeader className="justify-between">
                <div className="flex gap-5 items-center">
                    <Link to={`/profile/${username}`}>
                        <ProfilePicture username={username} size="lg"/>
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
            </CardHeader>
            <CardBody>
                <div className="flex flex-col items-center">
                    <p className="text-xl">{content}</p>
                    { (picture && picture != "") && <Image 
                        className=""
                        alt={`Picture for post ${id}`}
                        src={`/pictures/stock_images/${picture}`}
                    /> }
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
                <Button variant="bordered">               
                    <div className="flex gap-2">
                        <p>{numDislikes}</p>
                        <ThumbsDown size={24} />
                    </div>
                </Button>
            </CardFooter>
        </Card>
    )
}

module.exports = PostCard;


PostCard.propTypes = {
    id: PropTypes.string,
    username: PropTypes.string,
    userType: PropTypes.string,
    timestamp: PropTypes.number,
    content: PropTypes.string,
    picture: PropTypes.string,
    numComments: PropTypes.number,
    numDislikes: PropTypes.number
}

PostCard.defaultProps = {
    id: 0,
    username: "<No User>",
    userType: "standard",
    timestamp: 0,
    content: "",
    picture: null,
    numComments: 0,
    numDislikes: 0
}
