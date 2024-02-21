interface LoginContextType {
  login: (username: string, password: string) => Promise<void>;
}

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export type { LoginContextType, InputFieldProps };
