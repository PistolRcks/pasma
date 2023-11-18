const React = require('react')
const PropTypes = require('prop-types')
const { Card, CardBody, Image } = require('@nextui-org/react')

/**
 * Renders either a phrase or a photo depending on whether it received `phraseString` or `imageURL` as a prop. `phraseString` takes precedence.
 * @param {object} props - `sendProperty` sends the property of the card (phrase or image URL) up the component chain to the parent.
 */
function PostModalCard (props) {
    const { phraseString, imageURL, sendProperty } = props

    return (
        <div className="pb-4">
            <Card isPressable className="cursor-pointer" onPress={() => phraseString ? sendProperty(phraseString) : sendProperty(imageURL)}>
                <CardBody>
                    { phraseString != null ? 
                        <p>{phraseString}</p>
                        : 
                        <Image
                            isPressable
                            isZoomed
                            src={"pictures/stock_images/" + imageURL}
                        />
                    }
                </CardBody>
            </Card>
            
        </div>
    )
}

module.exports = PostModalCard

PostModalCard.propTypes = {
    phraseString: PropTypes.string,
    imageURL: PropTypes.string,
    sendProperty: PropTypes.func.isRequired
}

PostModalCard.defaultProps = {
    phraseString: null,
    imageURL: null
}
