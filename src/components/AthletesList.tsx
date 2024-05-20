import { getAthletes } from "@/pages/api/http-service/athletes";
import { faCheck, faEye, faFilePdf, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Loading from "react-loading";

import Image from "next/image";

import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import generatePDF, { Margin, Options } from "react-to-pdf";
import SoccerField from "./SoccerField";

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
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [infoPdf, setInfoPdf] = useState<PDFInfoResponseDTO>();
  const [observacaoDesempenho, setObservacaoDesempenho] = useState<string>();
  const [observacaoRelacionamento, setObservacaoRelacionamento] = useState<string>();
  const [clubes, setClubes] = useState<any>([]);
  const pdfRef = useRef<HTMLDivElement>();
  const [elementPdf, setElementPdf] = useState<any>(pdfRef.current);
  const btnPdfRef = useRef<any>();

  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athletesData = await getAthletes(page);
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
        setElementPdf(pdfRef.current);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setLoading(false);
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
          setLoading(false);
        }
      };

      fetchUpdatedAthletesData();
    }
  }, [newAthlete, inputFilter]);

  const handleEditAthlete = (id: number) => {
    push(`/secure/athletes/${id}/athleteDetail`);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
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
          setLoading(false);
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
        setLoading(true);
        const res = await PDFInfo(id);

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
        setLoading(false);
      }
    };
    fetchUpdatedAthletesData();
  }, [searchFilter]);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "150px" }}>
          <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
        </div>
      ) : (
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
                      <td className="table-dark text-end d-flex" style={{ whiteSpace: "nowrap" }}>
                        {/* <FontAwesomeIcon
                      icon={faTrashCan}
                      size="2xl"
                      style={{ color: '#ff0000', cursor: 'pointer' }}
                    /> */}
                        <div onClick={() => handleClickPdf(athlete.id)} ref={btnPdfRef}>
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
                          style={{ color: "#ffffff", cursor: "pointer" }}
                          onClick={() => handleEditAthlete(athlete.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="table-dark text-center">
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
      )}
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
            style={{ width: 200, height: "auto", maxWidth: "100%" }}
          />
          <h1 className="fw-bold h1  text-dark text-center">Relatório desempenho com atletas representados</h1>
          <Image
            src="/images/logo-arabe.png"
            alt="Logo Fort House"
            width={0}
            height={0}
            style={{ width: 150, height: "auto", maxWidth: "100%" }}
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
                style={{ width: "100%", height: "auto", maxWidth: "100%", objectFit: "contain" }}
              />
            ) : (
              <Image
                src="/images/icon-user.png"
                alt="Foto Atleta"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto", maxWidth: "100%", objectFit: "contain" }}
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
        <section className="mt-5">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">PERFIL FÍSICO E TÉCNICO</p>
            </div>

            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th className="h1" scope="col">
                    Data
                  </th>
                  <th className="h1" scope="col">
                    Estatura
                  </th>
                  <th className="h1" scope="col">
                    Envergadura
                  </th>
                  <th className="h1" scope="col">
                    Peso
                  </th>
                  <th className="h1" scope="col">
                    Percentual de Gordura
                  </th>
                </tr>
              </thead>
              <tbody>
                {infoPdf?.caracteristicas_fisicas.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td className="h2">{moment(x.data_criacao).format("DD/MM/YYYY")}</td>
                      <td className="h2">{x.estatura}</td>
                      <td className="h2">{x.envergadura}</td>
                      <td className="h2">{x.peso}</td>
                      <td className="h2">{x.percentual_gordura}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </section>
        <section className="mt-5">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">PERFIL TÉCNICO DIFERENCIAL</p>
            </div>

            <table className="table" style={{ maxWidth: "100%", width: "100%" }}>
              <thead>
                <tr>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Data
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Est.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Veloci.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    1x1
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Desmarq.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Ctrl de Bola
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Cruzamen.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Finzali.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Vis Espacial.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Dom Orien.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Dribles
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Leit. De Jogo
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Criativi.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Capac. De Descição
                  </th>
                  <th className="" scope="col" style={{ fontSize: 30 }}>
                    Competividade
                  </th>
                </tr>
              </thead>
              <tbody>
                {infoPdf?.caracteristicas_posicao.map((x, y) => {
                  return (
                    <tr key={y}>
                      <td style={{ fontSize: 25 }}>{moment(x.data_criacao).format("DD/MM/YYYY")}</td>
                      <td style={{ fontSize: 25 }}>{x.estatura_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.velocidade_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.um_contra_um_ofensivo_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.desmarques_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.controle_bola_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.cruzamentos_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.finalizacao_fis}</td>
                      <td style={{ fontSize: 25 }}>{x.visao_espacial_tec}</td>
                      <td style={{ fontSize: 25 }}>{x.dominio_orientado_tec}</td>
                      <td style={{ fontSize: 25 }}>{x.dribles_em_diagonal_tec}</td>
                      <td style={{ fontSize: 25 }}>{x.leitura_jogo_tec}</td>
                      <td style={{ fontSize: 25 }}>{x.criatividade_psi}</td>
                      <td style={{ fontSize: 25 }}>{x.capacidade_decisao_psi}</td>
                      <td style={{ fontSize: 25 }}>{x.competitividade_psi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </section>

        <section className="mt-4">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Histórico de Lesões </p>
            </div>

            <table className="table" style={{ maxWidth: "100%", width: "100%" }}>
              <thead>
                <tr>
                  <th className="h1">Data</th>
                  <th className="h1">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {infoPdf?.lesao.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td className="h2">{moment(x.data_lesao).format("DD/MM/YYYY")}</td>
                      <td className="h2">{x.descricao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </section>
        <section className="mt-4">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Histórico de Clubes </p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td className="h1">Date de Inicio</td>
                  <td className="h1">Data de Fim</td>
                  <td className="h1">Nome</td>
                </tr>
              </thead>
              <tbody>
                {clubes.map((x: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="h2">{moment(x.data_inicio).format("DD/MM/YYYY")}</td>
                      <td className="h2">{x.data_fim ? moment(x.data_fim).format("DD/MM/YYYY") : "--"}</td>
                      <td className="h2">{x.nome}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </section>
        <section className="mt-10">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Histórico de competição</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td className="h1">Nome</td>
                  <td className="h1">Gols</td>
                  <td className="h1">Jogos Completos</td>
                  <td className="h1">Jogos Parciais</td>
                  <td className="h1">Minutagem</td>
                </tr>
              </thead>
              <tbody>
                {infoPdf?.competicao.map((x, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="h2">{x.nome}</td>
                      <td className="h2">{x.gols}</td>
                      <td className="h2">{x.jogos_completos}</td>
                      <td className="h2">{x.jogos_parciais}</td>
                      <td className="h2">{x.minutagem}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* {infoPdf.clube.map((x, i) => {
                return (
                  <div className="row border-bottom border-2 mb-2 border-gray" key={i}>
                    <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                      Nome:
                      <span className="fw-normal"> {x.nome}</span>
                    </p>
                    <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                      Data de Inicio:
                      <span className="fw-normal"> {x.data_inicio}</span>
                    </p>
                    <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                      Data de Fim:
                      <span className="fw-normal"> {x.data_fim}</span>
                    </p>
                  </div>
                );
              })} */}
          </article>
        </section>
        <section className="mt-5">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Observações de Desempenho</p>
            </div>
            <div className="row border-bottom border-2 mb-2 border-gray">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                <textarea
                  disabled
                  className="w-100 bg-white border-black text-black"
                  style={{ resize: "none" }}
                  value={observacaoDesempenho}
                ></textarea>
              </p>
            </div>
          </article>
          {/* <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }} value={}></textarea> */}
        </section>
        <section className="mt-5">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Relacionamento</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td className="h1">Data</td>
                  <td className="h1">Receptividade Contrato</td>
                  <td className="h1">Satisfação da Empresa</td>
                  <td className="h1">Satisfação do Clube</td>
                  <td className="h1">Relação Familiares</td>
                  <td className="h1">Influências Externas</td>
                  <td className="h1">Pendência Empresa</td>
                  <td className="h1">Pendência Clube</td>
                </tr>
              </thead>
              <tbody>
                {infoPdf?.relacionamento.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td className="h1">
                        {x.data_criacao ? moment(x.data_criacao).format("DD/MM/YYYY").toString() : "---"}
                      </td>
                      <td className="h2">{x.receptividade_contrato}</td>
                      <td className="h2">{x.satisfacao_empresa}</td>
                      <td className="h2">{x.satisfacao_clube}</td>
                      <td className="h2">{x.relacao_familiares}</td>
                      <td className="h2">{x.influencias_externas}</td>
                      <td className="h2">{x.pendencia_empresa ? "Sim" : "Não"}</td>
                      <td className="h2">{x.pendencia_clube ? "Sim" : "Não"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </section>
        <section className="mt-5">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h1">Observações de Relacionamento</p>
            </div>
            <div className="row border-bottom border-2 mb-2 border-gray">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                <textarea
                  disabled
                  className="w-100 bg-white border-black text-black"
                  style={{ resize: "none" }}
                  value={observacaoRelacionamento}
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
