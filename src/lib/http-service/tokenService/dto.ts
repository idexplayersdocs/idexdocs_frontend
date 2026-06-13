export interface LoginRequestDTO {
  email: string;
  password: string;
}


export interface LoginResponseDTO {
  access_token: string;
  refresh_token?: string;
  "token_type": string;
}

export interface RefreshRequestDTO {
  refresh_token: string;
}

export interface RefreshResponseDTO {
  access_token: string;
  refresh_token?: string;
}