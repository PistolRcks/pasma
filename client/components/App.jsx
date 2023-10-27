// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')
const { AccountCreationCard } = require('./AccountCreationCard.jsx')

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
