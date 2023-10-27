// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')
const { ChangePassword } = require('./ChangePassword.jsx')

function App (props) {
  
    return (
      <div>
        <ProfilePicture username='alice'/>
        <ChangePassword username='alice'/>
      </div>
    )
}

module.exports = {
    App
}
