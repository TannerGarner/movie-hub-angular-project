export interface RawUser {
    email: string;
    username: string;
}

export interface SanitizedUser {
    email: string;
    username: string;
    userID: string;
}