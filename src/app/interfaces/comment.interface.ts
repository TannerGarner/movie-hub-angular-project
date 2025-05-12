import { Timestamp } from 'firebase/firestore';

export interface Comment {
    movieID: string;
    userID: string;
    text: string;
    date: Date;
    username: string;
}

export interface RawComment {
    movieID: string;
    userID: string;
    text: string;
    date: Timestamp;
}
