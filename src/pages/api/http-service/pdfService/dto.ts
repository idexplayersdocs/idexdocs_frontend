export interface PDFInfoResponseDTO {
    atleta: {
        nome: string;
        "clube_atual": string;
        contrato: {
            "data_inicio": Date;
            "data_terminio": Date;
            tipo:  string;
        }
        "data_nascimento": string;
        "posicao_primaria": string;
        "posicao_secundaria": string;
        "posicao_terciaria": string;
    },
    "caracteristicas_fisicas": [];
    "caracteristicas_posicao": [];
    clube: {
        "data_fim": Date | null;
        "data_inicio": Date;
        nome: string;
    }[];
    competicao: {
        "data_competicao": Date;
        gols: number;
        "jogos_completos": number;
        "jogos_parcias": number;
        minutagem: number;
        nome: string;
    }[];
    lesao: [];
    observacao: [];
    relacionamento: [];
}