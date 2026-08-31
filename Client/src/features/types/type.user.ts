export interface RegisterData{
    email:string
    password:string
    name:string
}

export interface LoginData{
    email:string
    password: string
}

export interface ChangeUserName {
    email: string;
    newName: string;
}


export interface IChangeUserName{
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>
}


export interface ForgotPasswordData {
    email: string;
}
  
export interface ResetPasswordData {
    newPassword: string;
    currentPassword: string;
}

export interface VerifyEmailData{
    email:string
}


export interface AuthResponse {
    message?: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
  
  export interface ApiError {
    error: string;
    response?: {
      data?: {
        error?: string;
      };
    };
    request?: unknown;
    message?: string;
}




export interface AuthLayoutProps{
    children: React.ReactNode
    title:string
}

export interface PasswordInputProps{
    value:string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder:string
    required?: boolean
    delay?: number
    name?:string
}

export interface AuthButtonProps{
    loading: boolean
    text: string
    type?: 'button' | 'submit' | 'reset';
}

export interface PasswordRequirementsProps{
    show:boolean
    onToggle: () => void
}



// interfaces/type.user.ts
export interface IContact {
  name: string;
  message: string;
  reason: string;  
}