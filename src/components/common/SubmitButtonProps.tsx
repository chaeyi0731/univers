interface SubmitButtonProps {
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label }) => {
  return (
    <button type="submit" className="submit-button">
      {label}
    </button>
  );
};

export default SubmitButton;
