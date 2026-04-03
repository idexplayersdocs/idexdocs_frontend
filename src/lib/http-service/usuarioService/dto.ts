export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  password: string;
  usuario_tipo_id: string;
  create_relacionamento: boolean;
  create_desempenho: boolean;
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
  permissoes: {
    create_relacionamento: boolean;
    create_desempenho: boolean;
  }
}


export interface UsuarioUpdateRequestDTO {
  id: number;
  nome: string;
  email: string;
  usuario_tipo_id: string;
  create_relacionamento: boolean;
  create_desempenho: boolean;
  
}