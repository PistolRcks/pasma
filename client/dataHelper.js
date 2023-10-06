/**
 * Asynchronously retrieve the profile picture from data endpoint
 * @returns {Promise}
 */
export async function retrieveProfilePicture () {
    try {
      // Send an AJAX request
      const response = await fetch('profile/get/profile_picture')
      if (response.status >= 400) {
        throw new Error(`Request failed with response code ${response.status}`)
      }
  
      // Return the response
      return await response.blob()
    } catch (err) {
      // something went wrong so return null
      console.error('Failed to retrieve profile picture')
      console.error(err)
      return null
    }
  }
