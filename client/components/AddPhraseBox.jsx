const React = require("react");
const {
    useDisclosure,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Spinner,
} = require("@nextui-org/react");
const PostModalCard = require("../components/PostModalCard");
const PropTypes = require("prop-types");
const { useEffect, useState } = require("react");

/**
 * Renders a textarea and modal used for adding phrases to a post.
 *
 * @param {object} props - Has the following:
 *  - isDisabled (default: false)
 *  - placeholder (placeholder text for the textarea; default: "Propagate passive aggression responsibly!")
 *  - description (description text for the textarea; default: "Click the field above to select a predefined phrase for your post.")
 *  - getPhrases (asynchronous function which returns the phrases displayed in the modal; required)
 *  - onSelectPhrase (synchronous function whose parameter is the selected phrase; fires when a phrase is selected; required)
 */
function AddPhraseBox(props) {
    const { isDisabled, placeholder, description, getPhrases, onSelectPhrase } =
        props;
    const [phrase, setPhrase] = useState(undefined);
    const [stockPhrases, setStockPhrases] = useState([]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const choosePhrase = (phraseString) => {
        onSelectPhrase(phraseString);
        setPhrase(phraseString);
        onOpenChange();
    };

    return (
        <>
            <Textarea
                isReadOnly
                isDisabled={isDisabled}
                className="cursor-pointer"
                minRows={8}
                size="lg"
                radius="none"
                value={phrase}
                placeholder={placeholder}
                description={description}
                onClick={async () => {
                    if (!isDisabled) {
                        if (stockPhrases.length === 0) {
                            setStockPhrases(await getPhrases());
                        }
                        onOpen();
                    }
                }}
            />
            <Modal
                size="2xl"
                scrollBehavior="inside"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader>
                        <p>Select a Phrase</p>
                    </ModalHeader>
                    <ModalBody>
                        {stockPhrases.length > 0 ? (
                            <div className="columns-2">
                                {stockPhrases.map((item, index) => (
                                    <PostModalCard
                                        key={item}
                                        phraseString={item}
                                        sendProperty={choosePhrase}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Spinner
                                className="pb-4"
                                label="Loading phrases..."
                                size="lg"
                                color="warning"
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

module.exports = AddPhraseBox;

AddPhraseBox.propTypes = {
    isDisabled: PropTypes.bool,
    placeholder: PropTypes.string,
    description: PropTypes.string,
    getPhrases: PropTypes.func.isRequired,
    onSelectPhrase: PropTypes.func.isRequired,
};

AddPhraseBox.defaultProps = {
    isDisabled: false,
    placeholder: "Propagate passive aggression responsibly!",
    description:
        "Click the field above to select a predefined phrase for your post.",
};
