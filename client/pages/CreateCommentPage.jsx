const React = require("react");
const { useState } = require("react");
const {
    Card,
    CardHeader,
    Button,
    CardBody,
    CardFooter,
} = require("@nextui-org/react");
const { ArrowBendUpLeft, PencilSimple } = require("@phosphor-icons/react");
const { useCookies } = require("react-cookie");
const { useParams, useNavigate } = require("react-router-dom");
const { getAllPhrases, createComment } = require("../dataHelper");
const AddPhraseBox = require("../components/AddPhraseBox");

/**
 * Renders the create comment page.
 * @param {object} props - Unused.
 */
function CreateCommentPage(props) {
    const { parentId } = useParams();
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [phrase, setPhrase] = useState(undefined);

    return (
        <div className="grid justify-items-center mt-6">
            <Card className="flex-auto w-1/2">
                <CardHeader>
                    <Button
                        isDisabled={isFormDisabled}
                        size="sm"
                        radius="full"
                        startContent={<ArrowBendUpLeft size={16} />}
                        onClick={() => {
                            navigate(`/post/${parentId}`);
                        }}
                    >
                        Back to Post
                    </Button>
                </CardHeader>
                <CardBody>
                    <AddPhraseBox
                        isDisabled={isFormDisabled}
                        description="Click the field above to select a predefined phrase for your comment."
                        getPhrases={() => getAllPhrases(cookies.token)}
                        onSelectPhrase={setPhrase}
                    />
                </CardBody>
                <CardFooter className="flex justify-between items-end">
                    <Button
                        isDisabled={
                            (!phrase || isFormDisabled) &&
                            !(phrase && !isFormDisabled)
                        } //* XOR
                        isLoading={isFormDisabled}
                        color={phrase ? "primary" : "default"}
                        radius="full"
                        endContent={<PencilSimple className="h-6 w-6" />}
                        onClick={() => {
                            setIsFormDisabled(true);
                            createComment(cookies.token, parentId, phrase)
                                .then((data) => {
                                    navigate(`/post/${parentId}`);
                                })
                                .catch((reason) => {
                                    window.alert(reason);
                                });
                        }}
                    >
                        Create Comment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

module.exports = CreateCommentPage;
