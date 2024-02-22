import { ReactNode } from 'react';

interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  timestamp: string;
  name: string;
}

interface PostDetail {
  post_id: number;
  title: string;
  content: string;
  image_url: string | null;
}

interface User {
  user: User | null;
  user_id: number;
  username: string;
  password: string;
  phone_number: string;
  name: string;
  address: string;
}

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

interface LoginContextType {
  login: (username: string, password: string) => Promise<void>;
}
interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
interface UserInfo {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
}
interface Post {
  post_id: number;
  title: string;
  name: string;
  timestamp: string;
}

interface Apod {
  title: string;
  explanation: string;
  url: string;
}
interface UserProviderProps {
  children: ReactNode;
}

export type { Comment, PostDetail, User, Message, LoginContextType, UserInfo, UserContextType, Post, Apod, UserProviderProps };
