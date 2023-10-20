/**
 * Asynchronously retrieve the profile picture from data endpoint
 * @returns {Promise}
 */
export async function retrieveProfilePicture (username) {
    try {
      // Send an AJAX request
      const response = await fetch(`api/getProfilePicture/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
      if (response.status >= 400) {
        throw new Error(`Request failed with response code ${response.status}`)
      }
  
      // Return the response
      return await response.text()
    } catch (err) {
      // something went wrong so return null
      console.error('Failed to retrieve profile picture')
      console.error(err)
      return null
    }
  }
