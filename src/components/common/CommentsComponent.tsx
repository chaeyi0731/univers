import React from 'react';
import { CommentsComponentProps } from './interfaces/interfaces'; // 경로는 실제 위치에 맞게 조정하세요.

const CommentsComponent: React.FC<CommentsComponentProps> = ({ comments, newComment, setNewComment, handleCommentSubmit }) => {
  return (
    <div className="comments-section">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.comment_id} className="comment">
          <p>{comment.content}</p>
          <span>{comment.name}</span>
          <span>{new Date(comment.timestamp).toLocaleString()}</span>
        </div>
      ))}
      <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
      <button onClick={handleCommentSubmit} className="post-button">
        Submit Comment
      </button>
    </div>
  );
};

export default CommentsComponent;
