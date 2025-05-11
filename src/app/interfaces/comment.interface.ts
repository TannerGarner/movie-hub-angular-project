import { Timestamp } from 'firebase/firestore';

export interface RawComment {
    movieID: string;
    userID: string;
    text: string;
    date: Timestamp;
}

export interface SanitizedComment {
    movieID: string;
    userID: string;
    text: string;
    date: Date;
    username: string;
}
