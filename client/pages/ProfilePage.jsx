const React = require('react');
const { useParams } = require('react-router-dom');

/**
 * Renders the user profile page.
 * 
 * The route returns the param of 'username', which is the username 
 * whose profile page should be loaded.
 * @param {object} props - Unused.
 */
function ProfilePage(props) {
    const { username } = useParams();

    return (
        <p>{`This page is "/profile/${username}" (the user profile page).`}</p>
    );
}

module.exports = ProfilePage;
