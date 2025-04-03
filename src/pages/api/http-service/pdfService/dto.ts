export interface PDFInfoResponseDTO {
  atleta: Atleta
  clube: Clube[]
  lesao: Lesao[]
  controle: Controle[]
  competicao: Competicao[]
  observacao: any
  observacao_desempenho: {
    id: number;
    tipo: string;
    descricao: string;
    data_criacao: Date;
  },
  observacoes_relacionamento: {
    id: number;
    tipo: string;
    descricao: string;
    data_criacao: Date;
  },
  relacionamento: Relacionamento[]
  caracteristicas_fisicas: CaracteristicasFisica[]
  caracteristicas_posicao: CaracteristicasPosicao[]
  imagens: [],
  videos: []
}

export interface Atleta {
  nome: string
  data_nascimento: string
  posicao_primaria: string
  posicao_secundaria: string
  posicao_terciaria: string
  clube_atual: string
  contrato: Contrato
  blob_url: string;
}

export interface Contrato {
  tipo: string
  data_inicio: string
  data_termino: string
}

export interface Clube {
  clube_id: number
  nome: string
  data_inicio: string
  data_fim?: string
}

export interface Lesao {
  data_lesao: string
  descricao: string
}

export interface Controle {
  atleta_id: number
  nome: string
  quantidade: number
  preco: number
  data_controle: string
}

export interface Competicao {
  nome: string
  data_competicao: string
  jogos_completos: number
  jogos_parciais: number
  minutagem: number
  assistencias: number
  gols: number
}

export interface Observacao {
  atleta_id: number
  tipo: string
  descricao: string
  data_observacao: string
}

export interface Relacionamento {
  atleta_id: number
  receptividade_contrato: number
  satisfacao_empresa: number
  satisfacao_clube: number
  relacao_familiares: number
  influencias_externas: number
  pendencia_empresa: boolean
  pendencia_clube: boolean
  data_criacao: string
}

export interface CaracteristicasFisica {
  id: number
  estatura: number
  envergadura: number
  peso: number
  percentual_gordura: number
  data_criacao: string
  data_avaliacao: string
  data_atualizado: any
  atleta_id: number
}

export interface CaracteristicasPosicao {
  id: number
  estatura_fis: number
  velocidade_fis: number
  um_contra_um_ofensivo_fis: number
  desmarques_fis: number
  controle_bola_fis: number
  cruzamentos_fis: number
  finalizacao_fis: number
  visao_espacial_tec: number
  dominio_orientado_tec: number
  dribles_em_diagonal_tec: number
  leitura_jogo_tec: number
  reacao_pos_perda_tec: number
  criatividade_psi: number
  capacidade_decisao_psi: number
  inteligencia_tatica_psi: number
  competitividade_psi: number
  data_criacao: string
  data_atualizado: any
  atleta_id: number
  data_avaliacao: string;        
}
