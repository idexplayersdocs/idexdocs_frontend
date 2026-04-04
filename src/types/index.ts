// ============ GENERIC ============

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  count?: number;
}

export interface ApiResponse<T> {
  data: T;
  count?: number;
  type?: string;
}

// ============ ATHLETE ============

export interface AthleteListItem {
  id: number;
  nome: string;
  data_nascimento: string; // YYYY-MM-DD
  posicao_primaria: number | string | null;
  clube_atual: string | null;
  data_proxima_avaliacao_relacionamento: string | null;
  ativo: boolean;
}

export interface AthleteContract {
  tipo: string;
  data_inicio: string;
  data_termino: string;
  data_expiracao: string;
}

export interface AthleteDetail {
  nome: string;
  data_nascimento: string;
  posicao_primaria: number | null;
  posicao_secundaria: number | null;
  posicao_terciaria: number | null;
  clube_atual: string | null;
  contratos: AthleteContract[];
  blob_url: string | null;
  ativo: boolean;
  physical?: PhysicalCharacteristic;
}

export interface AthleteCreateRequest {
  nome: string;
  data_nascimento: string;
  posicao_primaria: string;
  posicao_secundaria: string;
  posicao_terciaria: string;
}

export interface AthleteCreateResponse {
  id: number;
}

// ============ RELATIONSHIP ============

export interface Relationship {
  id?: number;
  atleta_id: number | string;
  receptividade_contrato: number | string;
  satisfacao_empresa: number | string;
  satisfacao_clube: number | string;
  relacao_familiares: number | string;
  influencias_externas: number | string;
  pendencia_empresa: boolean | string;
  pendencia_clube: boolean | string;
  data_avaliacao: string;
}

// ============ SUPPORT CONTROL ============

export interface SupportControl {
  controle_id?: number;
  atleta_id: number | string;
  nome: string;
  quantidade: number | string;
  preco: number | string;
  data_controle: string;
  arquivo?: File | null;
  arquivo_url?: string | null;
}

export interface SupportControlResponse {
  controles: SupportControl[];
  total: number;
}

// ============ CONTRACT ============

export interface Contract {
  id?: number;
  contrato_sub_tipo_id: number;
  data_inicio: string;
  data_termino: string;
  observacao?: string | null;
  versao?: number;
  ativo?: boolean;
  contrato_sub_tipo_nome?: string;
}

export interface ContractVersion {
  id?: number;
  versao: number;
  data_inicio: string;
  data_termino: string;
  observacao?: string | null;
}

// ============ CLUB ============

export interface Club {
  id?: number;
  nome: string;
  data_inicio: string;
  data_fim: string;
  clube_atual: boolean;
  atleta_id?: number;
}

// ============ COMPETITION ============

export interface Competition {
  id?: number;
  nome: string;
  data_competicao: string;
  jogos_completos: number;
  jogos_parciais: number;
  minutagem: number;
  gols: number;
  assistencias: number;
  atleta_id?: number;
}

// ============ INJURY ============

export interface Injury {
  id?: number;
  data_lesao: string;
  descricao: string;
  data_retorno?: string | null;
  atleta_id?: number;
}

// ============ OBSERVATION ============

export type ObservationType = 'desempenho' | 'relacionamento';

export interface Observation {
  id?: number;
  tipo: ObservationType;
  descricao: string;
  atleta_id?: number | string;
}

// ============ PHYSICAL CHARACTERISTICS ============

export interface PhysicalCharacteristic {
  id?: number;
  estatura?: number | null;
  envergadura?: number | null;
  peso?: number | null;
  percentual_gordura?: number | null;
  data_avaliacao?: string | null;
}

// ============ GALLERY ============

export interface GalleryImage {
  imagem_id: number;
  blob_url: string;
  descricao?: string | null;
}

export interface GalleryVideo {
  id: number;
  blob_url: string;
  tipo?: 'video' | 'youtube';
  descricao?: string | null;
}

export interface AthleteLink {
  id: number;
  url: string;
  descricao?: string | null;
}

// ============ PERMISSIONS ============

export interface UserPermissions {
  relationship: boolean;
  performance: boolean;
}

export interface DecodedToken {
  user_id: number;
  user_name: string;
  sub: string; // email
  roles: string[];
  permissions: string[];
  exp: number;
}

// ============ POSITIONS ============

export enum PositionId {
  NENHUM = 1,
  GOLEIRO = 2,
  LATERAL_DIREITO = 3,
  LATERAL_ESQUERDO = 4,
  ZAGUEIRO = 5,
  VOLANTE = 6,
  MEIA_ARMADOR = 7,
  MEIA_ATACANTE = 8,
  ATACANTE = 9,
  CENTROAVANTE = 10,
  EXTREMO_DIREITO = 11,
  EXTREMO_ESQUERDO = 12,
}

export const POSITION_LABELS: Record<number, string> = {
  [PositionId.NENHUM]: 'NENHUM',
  [PositionId.GOLEIRO]: 'GOLEIRO',
  [PositionId.LATERAL_DIREITO]: 'LATERAL DIREITO',
  [PositionId.LATERAL_ESQUERDO]: 'LATERAL ESQUERDO',
  [PositionId.ZAGUEIRO]: 'ZAGUEIRO',
  [PositionId.VOLANTE]: 'VOLANTE',
  [PositionId.MEIA_ARMADOR]: 'MEIA ARMADOR',
  [PositionId.MEIA_ATACANTE]: 'MEIA ATACANTE',
  [PositionId.ATACANTE]: 'ATACANTE',
  [PositionId.CENTROAVANTE]: 'CENTROAVANTE',
  [PositionId.EXTREMO_DIREITO]: 'EXTREMO DIREITO',
  [PositionId.EXTREMO_ESQUERDO]: 'EXTREMO ESQUERDO',
};
