const React = require('react')
const PropTypes = require('prop-types')
const { Button, Card, CardBody, CardHeader, CardFooter, Image } = require('@nextui-org/react')
const { X } = require('@phosphor-icons/react')

function PostModalCard (props) {
    const { phraseString, imageURL, sendProperty } = props

    return (
        <div className="pb-4">
            <Card isPressable isFooterBlurred className="cursor-pointer" onPress={() => phraseString ? sendProperty(phraseString) : sendProperty(imageURL)}>
                <CardBody>
                    { phraseString != null ? 
                        <p>{phraseString}</p>
                        : 
                        <Image
                            isPressable
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
    imageURL: PropTypes.string
}

PostModalCard.defaultProps = {
    phraseString: null,
    imageURL: null
}
