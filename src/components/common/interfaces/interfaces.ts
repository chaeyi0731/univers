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
  children: React.ReactNode;
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

interface Post {
  post_id: number;
  title: string;
  name: string;
  timestamp: string;
}
//? 게시글 상세
interface PostDetail {
  post_id: number;
  title: string;
  content: string;
  image_url: string | null;
}
//? post 타이틀 interface
interface PostTitleFieldProps {
  label: string;
  name: string; // 이 줄 추가
  value: string;
  onChange: (e: any) => void; // 여기서 타입을 any로 변경
  type?: 'text' | 'textarea';
}
//? post 내용 interface
interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

//? post에서 파일 업로드 interface
interface FileUploadFieldProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

//? universePage interface
interface Apod {
  title: string;
  explanation: string;
  url: string;
}

//?채팅관련 interface
interface Message {
  username: string;
  message: string;
  timestamp: string;
}

export type {
  Comment,
  PostDetail,
  User,
  Message,
  LoginContextType,
  UserInfo,
  UserContextType,
  Post,
  Apod,
  UserProviderProps,
  CommentsComponentProps,
  FileUploadFieldProps,
  PostTitleFieldProps,
  TextAreaFieldProps,
};
