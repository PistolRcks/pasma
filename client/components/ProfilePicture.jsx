import React from 'react'
import PropTypes from 'prop-types'

import { Avatar } from "@nextui-org/react";

export default function ProfilePicture (props) {
    const { username, size } = props

    const image = username + '.png'
  
    return (
      <div>
        <Avatar showFallback name= {`${username}`} src={`./images/${image}`} size={`${size}`}/>
      </div>
    )
}

ProfilePicture.propTypes = {
    username: PropTypes.string.isRequired,
    size: PropTypes.string
}

ProfilePicture.defaultProps = {
    size: "md"
}
