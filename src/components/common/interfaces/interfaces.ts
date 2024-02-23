import { ReactNode } from 'react';

//? 유저관련 interface
interface User {
  user: User | null;
  user_id: number;
  username: string;
  password: string;
  phone_number: string;
  name: string;
  address: string;
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

interface UserProviderProps {
  children: ReactNode;
}

//? 로그인 관련 interface

interface LoginContextType {
  login: (username: string, password: string) => Promise<void>;
}
// ? 댓글 관련 interface
interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  timestamp: string;
  name: string;
}

interface CommentsComponentProps {
  comments: Comment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleCommentSubmit: () => Promise<void>;
}

//? Post 관련 interface
interface PostDetail {
  post_id: number;
  title: string;
  content: string;
  image_url: string | null;
}

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

interface Post {
  post_id: number;
  title: string;
  name: string;
  timestamp: string;
}

//? universePage interface
interface Apod {
  title: string;
  explanation: string;
  url: string;
}

//? 파일 업로드 interface
interface FileUploadFieldProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
//? post 타이틀 interface
interface PostTitleFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
}

export type { Comment, PostDetail, User, Message, LoginContextType, UserInfo, UserContextType, Post, Apod, UserProviderProps, CommentsComponentProps, FileUploadFieldProps, PostTitleFieldProps };
