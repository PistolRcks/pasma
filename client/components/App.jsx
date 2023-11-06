// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')
const { ChangePassword } = require('./ChangePassword.jsx')
const { CookieTest } = require('./CookieTest.jsx')

function App (props) {
  
    return (
      <div>
        <ProfilePicture username='jared'/>
        <ProfilePicture username='jared' size="lg"/>
        <ChangePassword username='alice'/>
        <CookieTest cookieName='token'/>
      </div>
    )
}

module.exports = {
    App
}
