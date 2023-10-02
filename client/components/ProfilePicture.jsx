import React from 'react'
// import PropTypes from 'prop-types'

import { Avatar } from "@nextui-org/react";

export default function ProfilePicture () {
  
    return (
      <div>
        <h1>Hello World</h1>
        <Avatar showFallback name= "Jared" src="./images/jared.png" size="lg"/>
      </div>
    )
}
/*
ProfilePicture.propTypes = {
    userID: PropTypes.number.isRequired,
    userPicture: PropTypes.number,
}

ProfilePicture.defaultProps = {
    userPicture: -1
}*/
