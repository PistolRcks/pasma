const { Card, CardHeader, CardBody, CardFooter, Button } = require("@nextui-org/react");
const React = require("react");
const PropTypes = require('prop-types');
const ProfilePicture = require("../components/ProfilePicture");
const { ThumbsDown, ChatText } = require("@phosphor-icons/react");

/**
 * Generates a Card representing a Post.
 * @param {object} props - Has the following:
 *  - id
 *  - username
 *  - timestamp
 *  - content
 *  - numComments
 *  - numDislikes
 */
function PostCard(props) {
    const { id, username, timestamp, content, numComments, numDislikes } = props

    // TODO: Implement UserType and more text sizing
    // TODO: Implement Pictures

    return (
        <Card>
            <CardHeader className="justify-between">
                <div className="flex gap-5 items-center">
                    <ProfilePicture username={username} size="lg"/>
                    <div className="flex flex-col items-start">
                        <p className="font-semibold">{`@${username}`}</p>
                        <p>{new Date(timestamp).toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">{content}</p>
            </CardBody>
            <CardFooter className="place-content-between">
                <Button variant="bordered">
                    <div className="flex gap-2">
                        <ChatText size={24} />
                        <p>{numComments}</p>
                    </div>
                </Button>
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
    timestamp: PropTypes.number,
    content: PropTypes.string,
    numComments: PropTypes.number,
    numDislikes: PropTypes.number
}

PostCard.defaultProps = {
    id: 0,
    username: "<No User>",
    timestamp: 0,
    content: "",
    numComments: 0,
    numDislikes: 0
}
