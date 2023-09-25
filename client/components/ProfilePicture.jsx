import React from 'react'
import PropTypes from 'prop-types'

export default function ProfilePicture (props) {
  
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    )
}

ProfilePicture.propTypes = {
    userID: PropTypes.number.isRequired,
    userPicture: PropTypes.number,
}

ProfilePicture.defaultProps = {
    userPicture: -1
}
