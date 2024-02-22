import React from 'react';
import { Post } from '../common/interfaces/interfaces';

interface PostTableProps {
  posts: Post[];
  onRowClick: (postId: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ posts, onRowClick }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성시간</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.post_id} onClick={() => onRowClick(post.post_id)} style={{ cursor: 'pointer' }}>
            <td>{index + 1}</td>
            <td>{post.title}</td>
            <td>{post.name}</td>
            <td>{new Date(post.timestamp).toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PostTable;
