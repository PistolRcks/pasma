/**
 * Asynchronously retrieve the profile picture from data endpoint
 * @returns {Promise}
 */
export async function retrieveProfilePicture (username) {
    try {
      // Send an AJAX request
      const response = await fetch(`/api/getProfilePicture/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })

      if (response.status >= 400) {
        throw new Error(`Error ${response.status} - Call to DB for profile picture failed because no user exists with username ${username}`)
      }
      else {
        // Return the response
        return await response.text()
      }

    } catch (err) {
      // something went wrong so return null
      console.error('Failed to retrieve profile picture')
      console.error(err)
      return null
    }
  }

export async function sendUpdatedPassword (token, oldPass, newPass) {
    try {
        // Send an AJAX request
        const response = await fetch(`api/profile/settings/password`, {
          method: "POST",
          body: JSON.stringify({
            token: token,
            oldPassword: oldPass,
            newPassword: newPass
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
        })
  
        if (response.status >= 400) {
          throw new Error(`Error ${response.status} - Password update failed`)
        }
        else {
          // Return the response
          return await response.text()
        }
  
    } catch (err) {
        // something went wrong so return null
        console.error('Failed to update password')
        console.error(err)
        return null
    }
}


/**
 * Retrieves a list of valid phrases from the database
 * 
 * @returns A list of phrases as an array
 */
export async function getAllPhrases(token) {
    const getPhrases = await fetch("/api/getPhrases", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"token": token})
    })
    if(getPhrases.status === 400 || getPhrases.status === 401 || getPhrases.status === 500) {
        window.alert((await getPhrases.text()).toString())
    } else if(getPhrases.status === 200) {
        const phrases = JSON.parse(await getPhrases.text())
        console.log("phrases:")
        console.log(phrases)
        return phrases
    }
}
