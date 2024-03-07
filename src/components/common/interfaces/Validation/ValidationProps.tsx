interface ValidationProps {
  values: {
    username: string;
    password: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  setValidationPassed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ValidationProps;
