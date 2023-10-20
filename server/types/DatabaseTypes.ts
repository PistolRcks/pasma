// Contains all type definitions and type guards for database objects.

export interface User {
    Username: string;
    Password: string;
    Salt: string;
    ProfilePicture: string;
}

export interface Post {
    Username: string;
    Content: string;
    Picture: Blob;
    Timestamp: number;
}

/**
 * Type guard for a User object
 * @param {User} x User object to check
 * @returns {boolean} Is x a User object?
 */
export function isUser(x: any): x is User {
    if (!("Username" in x)) {
        console.log("Username not in object");
    }
    if (!("Password" in x)) {
        console.log("Password not in object");
    }
    if (!("Salt" in x)) {
        console.log("Salt not in object");
    }
    if (!("ProfilePicture" in x)) {
        console.log("ProfilePicture not in object");
    }
    return "Username" in x && "Password" in x && "Salt" in x && "ProfilePicture" in x;
}

/**
 * Type guard for a Post object
 * @param {Post} x Post object to check
 * @returns {boolean} Is x a Post object?
 */
export function isPost(x: any): x is Post {
    return "Username" in x && "Content" in x && "Picture" in x && "Timestamp" in x;
}
