import { FieldValue } from 'firebase/firestore';

export interface Post {
  id?: string;
  content: string;
  user: string;
  avatar: string;
  image: string;
  userId: string;
  likes: number;
  comments: number;
  createdAt: string | FieldValue;
}
