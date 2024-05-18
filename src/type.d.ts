export interface UserType {
  name: string;
  email: string;
  type: string;
  password: string;
}

export interface RegisterSuccessType {
  success: boolean;
  user: UserType;
}
