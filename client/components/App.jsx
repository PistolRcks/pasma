// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')
const AccountCreationCard = require('./AccountCreationCard.jsx')
const {Image} = require('@nextui-org/react')

function App (props) {
  
    return (
      <div>
        <AccountCreationCard/>
      </div>
    )
}

module.exports = {
    App
}
