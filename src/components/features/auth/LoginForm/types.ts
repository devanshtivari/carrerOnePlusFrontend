export interface InputFieldProps {
  id: string;
  label: string;
  icon: any;
  value: string;
  setValue: (val: string) => void;
  type?: string;
  isPassword?: boolean;
  showPwd?: boolean;
  setShowPwd?: (val: boolean) => void;
}
