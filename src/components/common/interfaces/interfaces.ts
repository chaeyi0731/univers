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
  username: string;
  name: string;
  user_id: number;
}

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export type { Comment, PostDetail, User, Message };
