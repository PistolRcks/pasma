/**
 * Contains pertinent session information as provided by {@link login#login}.
 */
export interface Session {
    token: string;
    username: string,
}