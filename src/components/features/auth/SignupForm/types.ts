export interface SelectOption {
  value: string;
  label: string;
}

export interface SignupInputFieldProps {
  id: string;
  label: string;
  icon: any;
  value: string;
  setValue: (val: string) => void;
  type?: string;
  options?: SelectOption[];
  isPassword?: boolean;
  showPwd?: boolean;
  setShowPwd?: (val: boolean) => void;
  maxLength?: number;
}
