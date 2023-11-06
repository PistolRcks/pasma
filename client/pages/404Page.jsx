const React = require('react');
const { Link } = require('react-router-dom')

function FourOhFourPage(props) {
    return (
        <div>
            <h1>404!</h1><br />
            <Link to={"/"}>Click here to return to the homepage.</Link>
        </div>
    )
}

module.exports = FourOhFourPage;
