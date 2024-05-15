export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  password: string;
  usuario_tipo_id: string;
}

export interface UsuarioResponseDTO {
  data: Usuario[];
  count: number;
  total: number;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_criacao: string;
  tipo: any;
}


export interface UsuarioUpdateRequestDTO {
  id: number;
  nome: string;
  email: string;
  usuario_tipo_id: string;
}