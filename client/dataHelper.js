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
export async function sendUpdatedPassword(token, oldPass, newPass) {
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
 * Retrieves a list of valid phrases from the database
 *
 * @param {String} token The session token from the cookie system
 * @returns {Array} A list of phrases as an array
 */
export async function getAllPhrases(token) {
    const response = await fetch("/api/getPhrases", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (response.status !== 200) {
        console.error(await response.text());
    } else {
        return await response.json();
    }
}

/**
 * Retrieves a list of valid stock image file names from the database
 *
 * @param {String} token The session token from the cookie system
 * @returns {Array} A list of file names as an array
 */
export async function getAllStockImages(token) {
    const response = await fetch("/api/getStockImages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (response.status !== 200) {
        window.alert(await response.text());
    } else {
        return await response.json();
    }
}

/**
 * Creates a new post from the content passed into it
 *
 * @param {Object} newPost JSON object consisting of the session token, post content, and picture file name
 * @returns {int} Response code from the API
 */
export async function createPost(newPost) {
    const response = await fetch("/api/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
    });

    if (response.status !== 200) {
        window.alert(await response.text());
        setIsFormDisabled(false);
    }

    return response.status;
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
        body: JSON.stringify({ token }),
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
        body: JSON.stringify({ token, id }),
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
    const response = await fetch("/api/getProfilePictures", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.status !== 200) {
        window.alert(await response.text());
    } else {
        return await response.json();
    }
}
/**
 * Creates a new account from the JSON object data it receives
 *
 * @param {Object} newAccount A JSON object consisting of
 * @returns {*} The JSON for cookie setting or false if an error occurred; null in all other cases
 */
export async function createNewAccount(newAccount) {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAccount),
        });
        if (response.status !== 200) {
            window.alert(await response.text());
            return false;
        } else {
            return await response.json();
        }
    } catch (error) {
        window.alert(error);
    }
    return null;
}

/**
 * Logs a user out
 *
 * @param {*} token The User's valid session token
 * @returns Returns OK if the user has successfully been logged out otherwise returns error
 */
export async function logOut(token) {
    try {
        // Send an AJAX request
        const response = await fetch(`api/logout`, {
            method: "POST",
            body: JSON.stringify({
                token: token,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        if (response.status >= 400) {
            throw new Error(`Error ${response.status} - Logout failed`);
        } else {
            // Return the response
            return await response.text();
        }
    } catch (err) {
        // something went wrong so return null
        console.error("Failed to logout");
        console.error(err);
        return null;
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

/**
 * Retrieves post data for a specific post
 * @param {string} token - A valid token used in the API call.
 * @param {string} id - the ID of the post to look for
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function getIndividualPost(token, id) {
    // Send an AJAX request
    const response = await fetch(`/api/feed`, {
        method: "POST",
        body: JSON.stringify({
            token,
            id,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    // Return the response
    return await response.json();
}

/**
 * Creates a comment under a post.
 * @param {string} token - A valid token used in the API call.
 * @param {string} id - the ID of the parent post to comment under
 * @param {string} content - the content of the comment
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function createComment(token, id, content) {
    const response = await fetch(`/api/comment`, {
        method: "POST",
        body: JSON.stringify({
            token,
            id,
            content,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    console.log(JSON.stringify({token, id, content}))

    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    // Return the response
    return await response.json();
}

/**
 * Edits a post. Lacks ability to edit image.
 * @param {string} token - A valid token used in the API call.
 * @param {string} id - the ID of the parent post to comment under
 * @param {string} content - the content of the edit
 * @returns {Promise} - resolves to an object
 * @throws an Error with the text defining what status code we got and
 *      what error occurred.
 */
export async function sendEditPost(token, id, content) {
    const response = await fetch(`/api/edit`, {
        method: "POST",
        body: JSON.stringify({
            "token": token,
            "id": id,
            "content": content
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    console.log(JSON.stringify({token, id, content}))

    if (response.status !== 200) {
        throw new Error(`Error ${response.status} - ${await response.text()}`);
    }

    // Return the response
    return await response.text();
}
