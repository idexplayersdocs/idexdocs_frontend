export interface LoginRequestDTO {
  email: string;
  password: string;
}


export interface LoginResponseDTO {
  access_token: string;
  "token_type": string;
}