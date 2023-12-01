const { useState } = require("react");
const React = require("react");
const { useParams } = require("react-router-dom");

/**
 * Renders the individual post page.
 *
 * The route returns the param of 'id', which is the id of the post
 * to read.
 * @param {object} props - Unused.
 */
function PostPage(props) {
    const { id } = useParams();

    const [mainPostComponent, setMainPostComponent] = useState(
        <>{"The main post component should be rendering here..."}</>
    );
    const [commentComponents, setCommentComponents] = useState([]);

    // Load in data
    const loadData = () => {
        
    }


    return (
        <div className="flex items-center justify-center p-8">
            <div className="w-1/2 grid grid-cols-1 gap-12 justify-stretch">
                {mainPostComponent}
                {commentComponents}
            </div>
        </div>
    )
}

module.exports = PostPage;
