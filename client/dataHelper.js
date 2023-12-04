/**
 * Asynchronously retrieve the profile picture from data endpoint
 * @returns {Promise}
 */
export async function retrieveProfilePicture(username) {
    try {
        // Send an AJAX request
        const response = await fetch(`/api/getProfilePicture/${username}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        if (response.status >= 400) {
            throw new Error(
                `Error ${response.status} - Call to DB for profile picture failed because no user exists with username ${username}`
            );
        } else {
            // Return the response
            return await response.text();
        }
    } catch (err) {
        // something went wrong so return null
        console.error("Failed to retrieve profile picture");
        console.error(err);
        return null;
    }
}

/**
 * Sends updated password to server
 * 
 * @param {*} token 
 * @param {*} oldPass 
 * @param {*} newPass 
 * @returns 
 */
export async function sendUpdatedPassword (token, oldPass, newPass) {
    try {
        // Send an AJAX request
        const response = await fetch(`api/profile/settings/password`, {
            method: "POST",
            body: JSON.stringify({
                token: token,
                oldPassword: oldPass,
                newPassword: newPass,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status >= 400) {
            throw new Error(
                `Error ${response.status} - Password update failed`
            );
        } else {
            // Return the response
            return await response.text();
        }
    } catch (err) {
        // something went wrong so return null
        console.error("Failed to update password");
        console.error(err);
        return null;
    }
}

/**
 * Retrieves post feed data for a specific user
 * @param {string} token - A valid token used in the API call.
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function retrievePostFeedData(token) {
    const response = await fetch(`/api/feed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token})
    });
    
    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}

/**
 * Flips the dislike bit on a certain post.
 * @param {string} token - A valid token used in the API call.
 * @param {string} id - The ID of the post whose dislike to flip
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function flipDislike(token, id) {
    const response = await fetch(`/api/react`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token, id})
    });
    
    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    return await response.text();
}

/**
 * Retrieves a list of valid profile picture file names from the database
 * 
 * @param {String} token The session token from the cookie system
 * @returns {Array} A list of file names as an array
 */
export async function getAllProfilePictures(token) {
    const getProfilePictures = await fetch("/api/getProfilePictures", {
        //method: "POST",
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }//,
        //body: JSON.stringify({"token": token})
    })
    if(getProfilePictures.status === 403 || getProfilePictures.status === 500) {
        window.alert((await getProfilePictures.text()).toString())
    } else if(getProfilePictures.status === 200) {
        return JSON.parse(await getProfilePictures.text())
    }
}
/**
 * Creates a new account from the JSON object data it receives
 * 
 * @param {Object} newAccount A JSON object consisting of 
 * @returns {*} The JSON for cookie setting or false if an error occurred; null in all other cases
 */
export async function createNewAccount(newAccount) {
    //console.log(newAccount)
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAccount)
        })
        if(response.status === 400  || response.status === 500) {
            window.alert((await response.text()).toString())
            setIsFormDisabled(false)
            return false;
        }
        else if(response.status === 200) {
            newUserJSON = JSON.parse(await response.text())
            return newUserJSON;
        }

    } catch (error) {}
    return null;
}

/**
 * Logs a user out
 * 
 * @param {*} token The User's valid session token
 * @returns Returns OK if the user ahs successfully been logged out otherwise returns error
 */
export async function logOut (token) {
    try {
        // Send an AJAX request
        const response = await fetch(`api/logout`, {
          method: "POST",
          body: JSON.stringify({
            token: token
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
        })
  
        if (response.status >= 400) {
          throw new Error(`Error ${response.status} - Logout failed`)
        }
        else {
          // Return the response
          return await response.text()
        }
  
    } catch (err) {
        // something went wrong so return null
        console.error('Failed to logout')
        console.error(err)
        return null
    }
}

/**
 * Attempts to log in a user.
 * @param {string} username - the username of the user being logged in.
 * @param {string} password - the password of the user being logged in.
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function attemptLogin(username, password) {
    const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}
