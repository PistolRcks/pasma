// Here is the file which will act as the launching point for our React frontend.

const React = require('react')
const { ProfilePicture } = require('./ProfilePicture.jsx')
const { AccountCreationCard } = require('./AccountCreationCard.jsx')

function App (props) {
  
    return (
      <div>
        <AccountCreationCard/>
        <div class="grid grid-flow-col auto-cols-max">
            <div>01</div>
            <div>02</div>
            <div>03</div>
        </div>
      </div>
    )
}

module.exports = {
    App
}
