import React from 'react'
import PropTypes from 'prop-types'

import { Avatar } from "@nextui-org/react";

export default function ProfilePicture (props) {
    const { name, userImage, size } = props
  
    return (
      <div>
        <Avatar showFallback name= {`${name}`} src={`./images/${userImage}`} size={`${size}`}/>
      </div>
    )
}

ProfilePicture.propTypes = {
    name: PropTypes.string.isRequired,
    userImage: PropTypes.string,
    size: PropTypes.string
}

ProfilePicture.defaultProps = {
    userImage: "default.png",
    size: "md"
}
