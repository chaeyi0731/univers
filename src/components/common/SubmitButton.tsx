import React from 'react';

interface SubmitButtonProps {
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  return (
    <button onClick={onSubmit} type="button">
      게시글 작성
    </button>
  );
};

export default SubmitButton;