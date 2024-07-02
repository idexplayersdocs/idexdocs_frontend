import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { getAthletes } from "@/pages/api/http-service/athletes";
import Loading from "react-loading";
import moment from "moment";
import { faCheck, faEye, faFilePdf, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@mui/material";
import styles from "../styles/Login.module.css";
import { jwtDecode } from 'jwt-decode';




import Image from "next/image";

import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import generatePDF, { Margin, Options } from "react-to-pdf";
import SoccerField from "./SoccerField";
import Subtitle from "./Subtitle";

interface Athlete {
  id: number;
  nome: string;
  posicao_primaria: string;
  data_nascimento: string;
  clube_atual: string;
  data_proxima_avaliacao_relacionamento: any;
  ativo: boolean;
}

const options: Options = {
  // default is `save`
  method: "save",

  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.MEDIUM,
    // default is 'A4'
    format: "A2",
    // default is 'portrait'
    orientation: "portrait",
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution
};

export default function AthletesList({ newAthlete, inputFilter, searchFilter }: any) {
  const [page, setPage] = useState(1);
  const { push } = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalRow, setTotalRow]: any = useState();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [infoPdf, setInfoPdf] = useState<any>();
  const [observacaoDesempenho, setObservacaoDesempenho] = useState<string>();
  const [observacaoRelacionamento, setObservacaoRelacionamento] = useState<string>();
  const [clubes, setClubes] = useState<any>([]);
  const pdfRef = useRef<HTMLDivElement | any>();
  const [elementPdf, setElementPdf] = useState<any>(pdfRef.current);
  const btnPdfRef = useRef<any>();
  const router = useRouter();
  const [roles, setRoles] = useState<any>();
  const [permissions, setPermissions] = useState<any>({
    relationship: false,
    performance: false
  });

  const [labelCharacteristic, setLabelCharacteristic] = useState<any>();

  const convertLabelCharacteristic = (infoPdf: any) => {
    if (infoPdf?.atleta && (infoPdf?.atleta.posicao_primaria == 9 || infoPdf?.atleta.posicao_primaria == 10)) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Estatura / Maturação', 'Velocidade / Aceleração Curta Distância', '1 x 1 Ofensivo', 'Desmarques / Mobilidade', 'Controle de Bola', 'Cruzamento / Passes para Gol', 'Finalização', 'Total', 'Média'],
              tecnico: ['Data', 'Visão Espacial', 'Domínio Orientado / Ambidestria', 'Dribles em Diagonal (Direção à Baliza)', 'Leitura de Jogo', 'Reação Pós Perda', 'Total', 'Média'],
              psicologico: ['Data', 'Criatividade / Improvisação', 'Capacidade de Decisão / Confiança / Extroversão', 'Inteligência Tática / Intuição Antecipar Ações', 'Competitividade / Coragem / Concentração', 'Total', 'Média']
          }, 'api': {
              fisico: [{'data_avaliacao': null, 'estatura_fis': null, 'velocidade_fis': null, 'um_contra_um_ofensivo_fis': null, 'desmarques_fis': null, 'controle_bola_fis': null, 'cruzamentos_fis': null, 'finalizacao_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'visao_espacial_tec': null, 'dominio_orientado_tec': null, 'dribles_em_diagonal_tec': null, 'leitura_jogo_tec': null, 'reacao_pos_perda_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'criatividade_psi': null, 'capacidade_decisao_psi': null, 'inteligencia_tatica_psi': null, 'competitividade_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
    // Lateral esquerdo / Direito
    else if (infoPdf?.atleta && (infoPdf?.atleta.posicao_primaria == 3 || infoPdf?.atleta.posicao_primaria == 4)) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Estatura / Maturação', 'Velocidade', 'Passe Curto', 'Passe Longo', 'Capacidade Aeróbica', 'Fechamento Defensivo / Contenção', 'Total', 'Média'],
              tecnico: ['Data', 'Leitura de Jogo / Amplitude Organizacional', 'Participação Ofensiva / Penetração / Mobilidade', 'Cruzamento / 1 x 1 Ofencivo', 'Jogo Aéreo', 'Condução de Bola em Velocidade', 'Total', 'Média'],
              psicologico: ['Data', 'Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade', 'Inteligência Tática / Intuição Ent. Ação Advers.', 'Competitividade', 'Total', 'Média']
          },
          'api': {
              fisico: [{'data_avaliacao': null, 'estatura_fis': null, 'velocidade_fis': null, 'passe_curto_fis': null, 'passe_longo_fis': null, 'capacidade_aerobia_fis': null, 'fechemanento_defensivo_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'leitura_jogo_tec': null, 'participacao_ofensiva_tec': null, 'cruzamento_tec': null, 'jogo_aereo_tec': null, 'conducao_bola_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'lideranca_psi': null, 'confianca_psi': null, 'inteligencia_tatica_psi': null, 'competitividade_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
    // Meia Armador / Meia Atacante
    else if (infoPdf?.atleta && (infoPdf?.atleta.posicao_primaria == 7 || infoPdf?.atleta.posicao_primaria == 8)) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Estatura / Maturação', 'Velocidade', 'Leitura de Jogo / Cobertura Ofensiva / Contenção', 'Desmarques / Mobilidade', 'Controle de Bola / Passe para Gol', 'Capacidade Aeróbica', 'Finalização', 'Total', 'Média'],
              tecnico: ['Data', 'Visão Espacial', 'Domíinio Orientado / Ambidestria', 'Dribles', 'Organização Ação Ofensiva / Dinâmica', 'Pisada na Área para Finalizar / Penetração', 'Total', 'Média'],
              psicologico: ['Data', 'Criatividade e Improvisação', 'Capacidade de Decisão', 'Confiança / Responsabilidade', 'Inteligência Tática / Intuição Antecipar Ações', 'Competitividade / Coragem / Concentração', 'Total', 'Média']
          },
          'api': {
              fisico: [{'data_avaliacao': null, 'estatura_fis': null, 'velocidade_fis': null, 'leitura_jogo_fis': null, 'desmarques_fis': null, 'controle_bola_fis': null, 'capacidade_aerobia_fis': null, 'finalizacao_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'visao_espacial_tec': null, 'dominio_orientado_tec': null, 'dribles_tec': null, 'organizacao_acao_ofensica_tec': null, 'pisada_na_area_para_finalizar_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'criatividade_psi': null, 'capacidade_decisao_psi': null, 'confianca_psi': null, 'inteligencia_tatica_psi': null, 'competitividade_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
    // Zagueiro
    else if (infoPdf?.atleta && infoPdf?.atleta.posicao_primaria == 5) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Estatura / Maturação', 'Força / Recuperação / Cobertura', 'Passe Curto', 'Passe Longo', 'Jogo Aéreo', 'Confronto Defensivo 1 x 1 / Contenção', 'Total', 'Média'],
              tecnico: ['Data', 'Leitura de Jogo / Organização Defensiva', 'Ambidestria', 'Participação Ofensiva / Penetração / Mobilidade', 'Cabeceio Ofensivo', 'Passe Entre Linhas / Passe Longo Diagonal', 'Total', 'Média'],
              psicologico: ['Data', 'Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade', 'Inteligência Tática / Intuição Ent. Ação Advers.', 'Competitividade', 'Total', 'Média']
          },
          'api': {
              fisico: [{'data_avaliacao': null, 'estatura_fis': null, 'força_fis': null, 'passe_curto_fis': null, 'passe_longo_fis': null, 'jogo_aereo_fis': null, 'confronto_defensivo_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'leitura_jogo_tec': null, 'ambidestria_tec': null, 'participacao_ofensica_tec': null, 'cabeceio_ofensivo_tec': null, 'passe_entre_linhas_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'lideranca_psi': null, 'confianca_psi': null, 'inteligencia_tatica_psi': null, 'competitividade_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
    // Goleiro
    else if (infoPdf?.atleta && infoPdf?.atleta.posicao_primaria == 2) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Perfil', 'Maturação', 'Agilidade / Impulsão', 'Velocidade Membros Superiores', 'Flexibilidade', 'Posicionamento Ofensivo e Defensivo', 'Total', 'Média'],
              tecnico: ['Data', 'Leitura de Jogo', 'Jogo com os Pés / Reposição de Jogo', 'Organização da Defesa / Domínio da Área', 'Domínio Coberturas e Saídas', 'Total', 'Média'],
              psicologico: ['Data', 'Liderança', 'Coragem / Confiança', 'Concentração / Responsabilidade', 'Controle de Estresse', 'Total', 'Média']
          },
          'api': {
              fisico: [{'data_avaliacao': null, 'perfil_fis': null, 'maturacao_fis': null, 'agilidade_fis': null, 'velocidade_membros_superiores_fis': null, 'flexibilidade_fis': null, 'posicionamento_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'leitura_jogo_tec': null, 'jogo_com_pes_tec': null, 'organizacao_da_defesa_tec': null, 'dominio_coberturas_e_saidas_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'lideranca_psi': null, 'coragem_psi': null, 'concentracao_psi': null, 'controle_estresse_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
    // Volante
    else if (infoPdf?.atleta && infoPdf?.atleta.posicao_primaria == 6) {
      setLabelCharacteristic ({
          'label': {
              fisico: ['Data', 'Estatura / Maturação', 'Força / Desarmes / Contenção', 'Passe Curto', 'Capacidade Aeróbica', 'Dinâmica / Mobilidade / Penetração', 'Visão Espacial / Mudança de Corredores', 'Total', 'Média'],
              tecnico: ['Data', 'Leitura de Jogo / Coberturas / Espaço', 'Domínio Orientado / Ambidestria', 'Jogo Aéreo Ofensivo / Defensivo', 'Passes Verticais', 'Finalização de Média Distância', 'Total', 'Média'],
              psicologico: ['Data', 'Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade', 'Inteligência Tática / Intuição Ent. Ação Advers.', 'Competitividade / Coragem / Conventração', 'Total', 'Média']
          },
          'api': {
              fisico: [{'data_avaliacao': null, 'estatura_fis': null, 'forca_fis': null, 'passe_curto_fis': null, 'capacidade_aerobia_fis': null, 'dinamica_fis': null, 'visao_espacial_fis': null, 'sum': null, 'mean': null}],
              tecnico: [{'data_avaliacao': null, 'leitura_jogo_tec': null, 'dominio_orientado_tec': null, 'jogo_aereo_ofensivo_tec': null, 'passes_verticais_tec': null, 'finalizacao_media_distancia_tec': null, 'sum': null, 'mean': null}],
              psicologico: [{'data_avaliacao': null, 'lideranca_psi': null, 'confianca_psi': null, 'inteligencia_tatica_psi': null, 'competitividade_psi': null, 'sum': null, 'mean': null}]
          }
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    if (token) {
      setRoles(decoded.roles[0]);
      setPermissions({
        relationship: decoded.permissions.includes("create_relacionamento"),
        performance: decoded.permissions.includes("create_desempenho")
      });
    }
  }, []);

  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athletesData = await getAthletes(page);
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
        setElementPdf(pdfRef.current);
      } catch (error: any) {
        console.error("Error fetching athletes:", error);
        if(error.response.status == 401){
          window.localStorage.removeItem('token');
          router.push("/public/login")
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletesData();
  }, [page]);

  useEffect(() => {
    if (newAthlete) {
      const fetchUpdatedAthletesData = async () => {
        try {
          const athletesData = await getAthletes(1, inputFilter);
          setAthletes((prevAthletes) => [...prevAthletes, newAthlete]);
          setTotalRow(athletesData.total);
        } catch (error) {
          console.error("Error fetching athletes:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUpdatedAthletesData();
    }
  }, [newAthlete, inputFilter]);

  useEffect(() => {
    // console.log(pdfRef);
  }, []);

  const handleEditAthlete = (id: number) => {
    push(`/secure/athletes/${id}/athleteDetail`);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    console.log(infoPdf)
    if (infoPdf) {      
      if (elementPdf) {        
        elementPdf.classList.remove("pdf");
        generatePDF(pdfRef, {          
          method: "save",
          filename: `${infoPdf.atleta.nome} - ${moment(new Date()).format("DD/MM/YYYY").toString()}`,
          page: {
            margin: Margin.MEDIUM,

            format: "A2",

            orientation: "portrait",
          },
        }).then(() => {
          setIsLoading(false);
          setInfoPdf(undefined);
        });
        elementPdf.classList.add("pdf");
      }
    }
    setElementPdf(pdfRef.current);
  }, [infoPdf]);

  const handleClickPdf = async (id: number): Promise<void> => {
    let retry = false;

    const tryExecute = async () => {
      try {
        setIsLoading(true);
        const res = await PDFInfo(id, permissions);

        const clubes = res.clube.sort((a: any, b: any) => {
          if (!a.data_fim && !b.data_fim) {
            return 0;
          }
          if (!a.data_fim) {
            return -1;
          }
          if (!b.data_fim) {
            return 1;
          }

          return b.data_fim - a.data_fim;
        });

        if (res.observacao_desempenho) {
          setObservacaoDesempenho(res.observacao_desempenho.descricao);
        }

        if (res.observacoes_relacionamento) {
          setObservacaoRelacionamento(res.observacoes_relacionamento.descricao);
        }

        setClubes(clubes);
        setInfoPdf(res);
        convertLabelCharacteristic(res)
        
      } catch (e: unknown) {
        console.log(e);
        if (!retry) {
          retry = true;
          await tryExecute();
        }
      }
    };

    await tryExecute();
  };

  const onLoadingPdf = (isLoadingPDF: boolean) => {
    setLoadingPDF(isLoadingPDF);
  };

  // const searchAthlete = () => {
  //   const fetchUpdatedAthletesData = async () => {
  //     try {
  //       const athletesData = await getAthletes(1, inputFilter); // Passando o filtro para a função getAthletes
  //       setAthletes(athletesData.data);
  //       setTotalRow(athletesData.total);
  //       setPage(1);
  //     } catch (error) {
  //       console.error("Error fetching athletes:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUpdatedAthletesData();
  // };

  const validLabelDate = (dataAvaliacao: string) => {
    const currentDate = moment().startOf("day");
    const nextEvaluationDate = moment(dataAvaliacao).startOf("day");
    // const nextEvaluationDate = moment('2024-05-06').startOf('day');
    // Comparação das datas
    return currentDate.isAfter(nextEvaluationDate);
  };

  useEffect(() => {
    const fetchUpdatedAthletesData = async () => {
      try {
        const athletesData = await getAthletes(1, inputFilter);
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
        setPage(1);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpdatedAthletesData();
  }, [searchFilter]);

  return (
    <>
        <div>
          <div className="w-100 mt-3 mb-3" style={{ overflow: "auto" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-dark text-center" scope="col">
                    NOME
                  </th>
                  <th className="table-dark text-center" scope="col">
                    POSIÇÃO
                  </th>
                  <th className="table-dark text-center" scope="col">
                    D.NASCIMENTO
                  </th>
                  <th className="table-dark text-center" scope="col">
                    CLUBE
                  </th>
                  <th className="table-dark text-center" scope="col">
                    AVAL. RELACIONAMENTO
                  </th>
                  <th className="table-dark text-center">ATIVO</th>
                  <th className="table-dark text-center"></th>
                </tr>
              </thead>
              <tbody>
                {athletes.length > 0 ? (
                  athletes.map((athlete) => (
                    <tr key={athlete.id}>
                      <td className="table-dark text-center">{athlete.nome}</td>
                      <td className="table-dark text-center">{athlete.posicao_primaria}</td>
                      <td className="table-dark text-center">{moment(athlete.data_nascimento).format("DD/MM/YYYY")}</td>
                      <td className="table-dark text-center">{athlete.clube_atual}</td>
                      <td
                        className={`table-dark text-center ${
                          validLabelDate(athlete.data_proxima_avaliacao_relacionamento) ? "text-danger" : ""
                        }`}
                      >
                        {athlete.data_proxima_avaliacao_relacionamento
                          ? moment(athlete.data_proxima_avaliacao_relacionamento).format("DD/MM/YYYY")
                          : "Não Avaliado"}
                        {validLabelDate(athlete.data_proxima_avaliacao_relacionamento) && (
                          <FontAwesomeIcon
                            className="ms-2 mt-1"
                            icon={faTriangleExclamation}
                            style={{ color: "#ff0000" }}
                          />
                        )}
                      </td>
                      <td className="table-dark text-center">
                        <FontAwesomeIcon
                          icon={athlete.ativo ? faCheck : faXmark}
                          size="xl"
                          style={athlete.ativo ? { color: "#15ff00" } : { color: "#ff0000" }}
                        />
                      </td>
                      <td className="table-dark text-end" style={{ whiteSpace: "nowrap" }}>
                        {/* <FontAwesomeIcon
                      icon={faTrashCan}
                      size="2xl"
                      style={{ color: '#ff0000', cursor: 'pointer' }}
                    /> */}
                        <div onClick={() => handleClickPdf(athlete.id)} ref={btnPdfRef} style={{ display: "inline-block" }}>
                          <FontAwesomeIcon
                            className="ms-2 me-2"
                            icon={faFilePdf}
                            style={{ color: "white", cursor: "pointer" }}
                            size="2xl"
                          />
                        </div>
                        <FontAwesomeIcon
                          className="ms-2 me-2"
                          icon={faEye}
                          size="2xl"
                          style={{ color: "#ffffff", cursor: "pointer", display: "inline-block" }}
                          onClick={() => handleEditAthlete(athlete.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="table-dark text-center">
                      Lista de atletas vazia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center pb-5">
            {totalRow > 10 && (
              <Pagination
                className="pagination-bar"
                count={Math.ceil(totalRow / 10)}
                page={page}
                onChange={handleChangePage}
                variant="outlined"
                size="large"
                sx={{
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "var(--bg-ternary-color)",
                    color: "white",
                  },
                  "& .MuiPaginationItem-page": { color: "white" },
                  "& .MuiPaginationItem-icon": { color: "white" },
                }}
              />
            )}
          </div>
        </div>
        {isLoading ? (
          <div
            className={`d-flex justify-content-center align-items-center w-100 min-vh-100 z-3 position-absolute top-0 left-0 ${styles.overlay}`}
          >
            <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
          </div>
        ) : null}
      <div
        className="bg-white pointer rounded-2 p-4 mx-auto pdf"
        style={{ cursor: "pointer", width: "fit-content" }}
        ref={pdfRef}
        id="pdfRef"
      >
        <header className="d-flex align-items-center justify-content-center">
          <Image
            src="/images/logo-fort-house.png"
            alt="Logo Fort House"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "200px", height: "auto", maxWidth: "200px" }}
          />
          <h1 className="fw-bold h1  text-dark text-center">Relatório desempenho com atletas representados</h1>
          <Image
            src="/images/logo-arabe.png"
            alt="Logo Fort House"
            width={0}
            height={0}
            style={{ width: '150px', height: "auto", maxWidth: "150px" }}
            sizes="100vw"
          />
        </header>
        <section className="row">
          <article className="col-3 border border-black rounded p-2 d-flex align-items-center justify-content-center">
            {infoPdf?.atleta.blob_url ? (
              <Image
                src={infoPdf?.atleta.blob_url}
                alt="Foto atleta"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "300px", height: "auto", maxWidth: "300px" }}
              />
            ) : (
              <Image
                src="/images/icon-user.png"
                alt="Foto Atleta"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "300px", height: "auto", maxWidth: "300px" }}
              />
            )}
          </article>
          <article className="col-6">
            <div className="border-bottom border-4 border-black mb-3"></div>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold  h2 mb-3 d-flex align-items-center justify-content-between">
                Nome do Atleta: <span className="text-uppercase fw-normal">{infoPdf?.atleta.nome}</span>
              </p>
              <p className="fw-bold  h2 mb-3 d-flex align-items-center justify-content-between">
                Posição: <span className="text-uppercase fw-normal">{infoPdf?.atleta.posicao_primaria}</span>
              </p>
              <p className="fw-bold  h2 mb-3 d-flex align-items-center justify-content-between">
                Data de Nascimento:{" "}
                <span className="text-uppercase fw-normal">
                  {" "}
                  {moment(infoPdf?.atleta.data_nascimento).format("DD/MM/YYYY")}
                </span>
              </p>
              <p className="fw-bold mb-3 h2 mb-3 d-flex align-items-center justify-content-between">
                Clube Atual: <span className="text-uppercase fw-normal">{infoPdf?.atleta.clube_atual}</span>
              </p>
            </div>
          </article>
          <article className="col-3 ">
            <div className="p-1 d-flex align-items-center justify-content-end w-100 ">
              <div className="w-100">
                <SoccerField
                  athleteData={{
                    posicao_primaria: infoPdf?.atleta.posicao_primaria,
                    posicao_secundaria: infoPdf?.atleta.posicao_secundaria,
                    posicao_terciaria: infoPdf?.atleta.posicao_terciaria,
                  }}
                />
              </div>
            </div>
          </article>
        </section>

        {
            infoPdf?.caracteristicas_fisicas.length > 0 &&
              <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">HISTÓRICO FÍSICO</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Estatura</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Envergadura</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Peso</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>% Gordura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        infoPdf?.caracteristicas_fisicas.map((fisica: any, i: number) => (
                            <tr key={i}>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(fisica.data_avaliacao).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{fisica.estatura}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{fisica.envergadura}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{fisica.peso}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{fisica.percentual_gordura}</td>
                            </tr>
                          )
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
          }
        {
          infoPdf?.caracteristicas_posicao.fisico && 
            <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">PERFIL FÍSICO E TÉCNICO</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        {labelCharacteristic?.label.fisico.map((label: any, index: number) => (
                          <th key={index} className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {infoPdf?.caracteristicas_posicao && infoPdf?.caracteristicas_posicao.fisico && infoPdf?.caracteristicas_posicao.fisico.length > 0 ? (
                        infoPdf?.caracteristicas_posicao.fisico.map((data: any, index: number) => {
                          const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
                          return (
                            <tr key={index}>
                              {reorderedKeys.map((key: string, idx: number) => (
                                <td key={idx} className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>
                                  {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                                  {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                                    : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                                    : data[key]
                                  }
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={20} className="table-dark text-center">
                            Lista vazia
                          </td>
                        </tr>
                      )
                      }
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 w-100">
                  <h2 className="subtitle-pdf fw-bold">PERFIL TÉCNICO DIFERENCIAL</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        {labelCharacteristic?.label.tecnico.map((label: any, index: number) => (
                          <th key={index} className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {infoPdf?.caracteristicas_posicao && infoPdf?.caracteristicas_posicao.tecnico && infoPdf?.caracteristicas_posicao.tecnico.length > 0 ? (
                        infoPdf?.caracteristicas_posicao.tecnico.map((data: any, index: number) => {
                          const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
                          return (
                            <tr key={index}>
                              {reorderedKeys.map((key: string, idx: number) => (
                                <td key={idx} className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>
                                  {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                                  {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                                    : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                                    : data[key]
                                  }
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={20} className="table-dark text-center">
                            Lista vazia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 w-100">
                  <h2 className="subtitle-pdf fw-bold">PERFIL PSICOLÓGICO</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        {labelCharacteristic?.label.psicologico.map((label: any, index: number) => (
                          <th key={index} className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {infoPdf?.caracteristicas_posicao && infoPdf?.caracteristicas_posicao.psicologico && infoPdf?.caracteristicas_posicao.psicologico.length > 0 ? (
                        infoPdf?.caracteristicas_posicao.psicologico.map((data: any, index: number) => {
                          const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
                          return (
                            <tr key={index}>
                              {reorderedKeys.map((key: string, idx: number) => (
                                <td key={idx} className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>
                                  {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                                  {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                                    : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                                    : data[key]
                                  }
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={20} className="table-dark text-center">
                            Lista vazia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 w-100">
                  <h2 className="subtitle-pdf fw-bold">MÉDIA GERAL</h2>
                </div>
                <div className="mt-3 align-self-start media-das-medias" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Média Geral</th>
                      </tr>
                    </thead>
                    <tbody>
                    {infoPdf?.caracteristicas_posicao && infoPdf?.caracteristicas_posicao.total_mean && Object.keys(infoPdf?.caracteristicas_posicao.total_mean).length > 0 ? (
                      Object.entries(infoPdf?.caracteristicas_posicao.total_mean).map(([key, value], index) => (
                        <tr key={index}>
                          <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(key).format('DD/MM/YYYY')}</td>
                          <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{value as number}</td>
                        </tr>
                      ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="table-dark text-center">
                            Lista vazia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </section>
        }

          {
            infoPdf?.lesao.length > 0 &&
              <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">HISTÓRICO DE LESÕES</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Descrição</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data de Retorno</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        infoPdf?.lesao.map((lesao: any, i: number) => (
                            <tr key={i}>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(lesao.data_lesao).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{lesao.descricao}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(lesao.data_retorno).format("DD/MM/YYYY")}</td>
                            </tr>
                          )
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
          }

          {
            infoPdf?.clube.length > 0 &&
              <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">HISTÓRICO DE CLUBES</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Clube</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data de Início</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data de Término</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Clube Atual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        infoPdf?.clube.map((clube: any, i: number) => (
                          <tr key={i}>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{clube.nome}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(clube.data_inicio).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(clube.data_fim).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{clube.clube_atual ? 'Sim' : 'Não'}</td>
                            </tr>
                          )
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
          }
          {
            infoPdf?.competicao.length > 0 &&
              <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">HISTÓRICO DE COMPETIÇÕES</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Competição</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Jogos Completos</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Jogos Parciais</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Minutagem</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Gols</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Assistências</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        infoPdf?.competicao.map((competicao: any, i: number) => (
                          <tr key={i}>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(competicao.data_competicao).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.nome}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.jogos_completos}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.jogos_parciais}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.minutagem}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.gols}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{competicao.assistências}</td>
                            </tr>
                          )
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
          }
        <section className="mt-5">
          <article>
          <div className="mt-3 w-100">
            <h2 className="subtitle-pdf fw-bold">OBSERVAÇÃO DE DESEMPENHO</h2>
          </div>
            <div className="row border-bottom border-2 mb-2 border-gray">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                <textarea
                  disabled
                  className="w-100 bg-white border-black text-black"
                  style={{ resize: "none" }}
                  value={infoPdf?.observacoes_desempenho ? infoPdf?.observacoes_desempenho.descricao : ''}
                ></textarea>
              </p>
            </div>
          </article>
          {/* <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }} value={}></textarea> */}
        </section>

        {
            infoPdf?.relacionamento.length > 0 &&
              <section className="mt-4">
                <div className="mt-3 w-100">
                  <h2 className="subtitle-pdf fw-bold">RELACIONAMENTO</h2>
                </div>
                <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>Data</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>RECEPTIVIDADE CONTRATO</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>SATISFAÇÃO EMPRESA</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>SATISFAÇÃO CLUBE</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>RELAÇÕES FAMILIARES</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>INFLUÊNCIA EXTERNAS</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>PENDÊNCIAS EMPRESA</th>
                        <th className="text-center" style={{backgroundColor: '#626262', color: "#ffffff", fontSize: '20px', verticalAlign: 'middle'}}>PENDÊNCIAS CLUBE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        infoPdf?.relacionamento.map((relacionamento: any, i: number) => (
                          <tr key={i}>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{moment(relacionamento.data_avaliacao).format("DD/MM/YYYY")}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.receptividade_contrato}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.satisfacao_empresa}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.satisfacao_clube}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.relacao_familiares}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.influencias_externas}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.pendencia_empresa ? 'Sim' : 'Não'}</td>
                              <td className="text-center" style={{backgroundColor: '#ffffff', color: "#000", fontSize: '20px', verticalAlign: 'middle'}}>{relacionamento.pendencia_clube ? 'Sim' : 'Não'}</td>
                            </tr>
                          )
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
          }

        <section className="mt-5">
          <article>
            <div className="mt-3 w-100">
              <h2 className="subtitle-pdf fw-bold">OBSERVAÇÃO DE RELACIONAMENTO</h2>
            </div>
            <div className="row border-bottom border-2 mb-2 border-gray">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                <textarea
                  disabled
                  className="w-100 bg-white border-black text-black"
                  style={{ resize: "none" }}
                  value={infoPdf?.observacoes_relacionamento ? infoPdf?.observacoes_desempenho.observacoes_relacionamento : ''}
                ></textarea>
              </p>
            </div>
          </article>
          {/* <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }} value={}></textarea> */}
        </section>
      </div>
    </>
  );
}