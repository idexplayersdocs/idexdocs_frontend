export interface LoginRequestDTO {
  email: string;
  password: string;
}


export interface LoginResponseDTO {
  "acess_token": string;
  "token_type": string;
}