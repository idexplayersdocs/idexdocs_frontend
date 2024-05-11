export interface PDFInfoResponseDTO {
    atleta: Atleta
    clube: Clube[]
    lesao: Lesao[]
    controle: Controle[]
    competicao: Competicao[]
    observacao: Observacao[]
    relacionamento: Relacionamento[]
    caracteristicas_fisicas: CaracteristicasFisica[]
    caracteristicas_posicao: CaracteristicasPosicao[]
  }
  
  export interface Atleta {
    nome: string
    data_nascimento: string
    posicao_primaria: string
    posicao_secundaria: string
    posicao_terciaria: string
    clube_atual: string
    contrato: Contrato
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
    data_atualizado: any
    atleta_id: number
  }
  
  export interface CaracteristicasPosicao {
    id: number
    estatura: number
    velocidade: number
    um_contra_um_ofensivo: number
    desmarques: number
    controle_bola: number
    cruzamentos: number
    finalizacao: number
    visao_espacial: number
    dominio_orientado: number
    dribles_em_diagonal: number
    leitura_jogo: number
    reacao_pos_perda: number
    criatividade: number
    capacidade_decisao: number
    inteligencia_tatica: number
    competitividade: number
    data_criacao: string
    data_atualizado: any
    atleta_id: number
  }
  