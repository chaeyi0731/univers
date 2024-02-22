// 로그인 확인 인터페이스
interface LoginContextType {
  login: (username: string, password: string) => Promise<void>;
}

// 안풋관련 인터페이스
interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; // 수정된 부분
}

//post 관련 인터페이스
interface IPost {
  title: string;
  content: string;
  image: File | null;
}

export type { LoginContextType, InputFieldProps, IPost };
