const React = require('react')
const { useState, useEffect } = require('react')
const { retrieveProfilePicture } = require('../dataHelper.js')
const PropTypes = require('prop-types')
const { Avatar } = require("@nextui-org/react");

function ProfilePicture (props) {
    const { username, size } = props

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
        <Avatar showFallback name= {`${username}`} src={`/profile_pictures/${profilePictureName}`} size={`${size}`}/>
      </div>
    )
}

module.exports = {
    ProfilePicture
}

ProfilePicture.propTypes = {
    username: PropTypes.string.isRequired,
    size: PropTypes.string
}

ProfilePicture.defaultProps = {
    size: "md"
}
