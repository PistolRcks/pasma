// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')

function App (props) {
  
    return (
      <div>
        <ProfilePicture username='jared'/>
      </div>
    )
}

module.exports = {
    App
}
