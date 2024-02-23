// PostDetailComponent.jsx
import React from 'react';
import { PostDetail } from './interfaces/interfaces';

interface PostDetailComponentProps {
  postDetail: PostDetail | null;
}

const PostDetailComponent: React.FC<PostDetailComponentProps> = ({ postDetail }) => {
  if (!postDetail) return null;

  return (
    <div>
      <h1 className="post-title">{postDetail.title}</h1>
      <p className="post-content">{postDetail.content}</p>
      {postDetail.image_url && <img src={postDetail.image_url} alt="Post" className="post-image" />}
    </div>
  );
};

export default PostDetailComponent;
