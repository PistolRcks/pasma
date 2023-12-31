const React = require('react')
const { useState, useEffect } = require('react')
const { retrieveProfilePicture } = require('../dataHelper.js')
const PropTypes = require('prop-types')
const { Avatar } = require("@nextui-org/react");

function ProfilePicture (props) {
    const { username, size, styling } = props

    const [profilePictureName, setProfilePictureName] = useState('')
    useEffect(() => {
        async function fetchProfilePictureName () {
            const imageName = await retrieveProfilePicture(username)
            setProfilePictureName(imageName)
        }

        if (username !== '') {
            fetchProfilePictureName(username)
        }
    }, [username])
  
    return (
      <div>
        <Avatar
            showFallback
            name= {username}
            src={`/pictures/profile_pictures/${profilePictureName}`}
            size={size}
            className={styling}/>
      </div>
    )
}

module.exports = ProfilePicture

ProfilePicture.propTypes = {
    username: PropTypes.string,
    size: PropTypes.string,
    styling: PropTypes.string,
}

ProfilePicture.defaultProps = {
    username: "default.png",
    size: "md",
    styling: "",
}
