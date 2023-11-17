const React = require('react')
const PropTypes = require('prop-types')
const { Card, CardBody, Image } = require('@nextui-org/react')

function PostModalCard (props) {
    const { phraseString, imageURL } = props

    return (
        <Card className="cursor-pointer">
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
