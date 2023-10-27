// Contains all type definitions and type guards for database objects.

export interface User {
    Username: string;
    Password: string;
    Salt: string;
    ProfilePicture?: string;
    UserType: "standard" | "brand" | "moderator";
}

export interface Post {
    Username: string;
    Content: string;
    Picture: Blob;
    Timestamp: number;
}

/**
 * Contains the possible values for the `UserType` field in the table `User`.
 */
export const userTypes = ["standard", "brand", "moderator"];

/**
 * Type guard for a User object
 * @param {User} x User object to check
 * @returns {boolean} Is x a User object?
 */
export function isUser(x: any): x is User {
    return ("Username" in x 
        && "Password" in x 
        && "Salt" in x
        && "UserType" in x
        && userTypes.includes(x.UserType));
}

/**
 * Type guard for a Post object
 * @param {Post} x Post object to check
 * @returns {boolean} Is x a Post object?
 */
export function isPost(x: any): x is Post {
    return "Username" in x && "Content" in x && "Picture" in x && "Timestamp" in x;
}
