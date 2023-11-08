const React = require('react');
const { useParams } = require('react-router-dom');

/**
 * Renders the individual post page.
 * 
 * The route returns the param of 'id', which is the id of the post 
 * to read.
 * @param {object} props - Unused.
 */
function PostPage(props) {
    const { id } = useParams();

    return (
        <p>{`This page is "/post/${id}" (the individual post page).`}</p>
    );
}

module.exports = PostPage;
