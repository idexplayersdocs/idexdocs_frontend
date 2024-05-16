import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { getAthletes } from "@/pages/api/http-service/athletes";
import Loading from "react-loading";
import moment from "moment";
import { faEye, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Pagination, Modal } from "@mui/material";

import Image from "next/image";

import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import AthletePDF from "./AthletePDF";
import { GetFotoUsuario } from "@/pages/api/http-service/usuarioService";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

interface Athlete {
  id: number;
  nome: string;
  posicao_primaria: string;
  data_nascimento: string;
  clube_atual: string;
}

export default function AthletesList({ newAthlete, inputFilter, searchFilter }: any) {
  const [page, setPage] = useState(1);
  const { push } = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalRow, setTotalRow]: any = useState();
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [modalPdfOpen, setModalPdfOpen] = useState<boolean>(false);
  const effectRan = useRef(false);
  const [atletaInfo, setAtletaInfo] = useState<PDFInfoResponseDTO | null>(null);
  const [urlFoto, setUrlFoto] = useState<string>("");
  const [infoPdf, setInfoPdf] = useState<PDFInfoResponseDTO>();
  const [observacaoDesempenho, setObservacaoDesempenho] = useState<any>([]);
  const [clubes, setClubes] = useState<any>([]);
  const pdfRef = useRef<any>();


  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athletesData = await getAthletes(page);
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
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

  const handleClickPdf = async (id: number): Promise<void> => {
    try {
      const res = await PDFInfo(id);
      setInfoPdf(res);
      const obsDesempenho = res.observacao.filter((x) => x.descricao === "desempenho");
      setObservacaoDesempenho(obsDesempenho);

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

      setClubes(clubes);

      const element = pdfRef.current;
      element.classList.remove("pdf");
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF({
        format: 'a3'
      });

      pdf.addImage(data, 'PNG', 0, 0, canvas.width / 5, canvas.height / 5); // Ajuste as dimensões conforme necessário
  
      // Converta o PDF para um blob
      const pdfBlob = pdf.output('blob');
  
      // Crie um URL para o blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Abra o PDF em uma nova aba
      window.open(pdfUrl);
  
      // Ocultar novamente o elemento após gerar o PDF
      element.classList.add('pdf');


      // const resFoto = await GetFotoUsuario(id);
      // console.log(resFoto.blob_url);

      // setUrlFoto(resFoto.blob_url);
      // setAtletaInfo(res);
      // setModalPdfOpen(true);
    } catch (e: unknown) {
    } finally {
      setLoading(false);
    }
  };

  const onLoadingPdf = (isLoadingPDF: boolean) => {
    // console.log(isLoadingPDF);
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

  useEffect(() => {
    const fetchUpdatedAthletesData = async () => {
      try {
        const athletesData = await getAthletes(1, inputFilter); // Passando o filtro para a função getAthletes
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "150px" }}>
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3 m-3 overflow-auto">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark" scope="col">
                NOME
              </th>
              <th className="table-dark" scope="col">
                POSIÇÃO
              </th>
              <th className="table-dark" scope="col">
                D.NASCIMENTO
              </th>
              <th className="table-dark" scope="col">
                CLUBE ATUAL
              </th>
              <th className="table-dark"></th>
            </tr>
          </thead>
          <tbody>
            {athletes.length > 0 ? (
              athletes.map((athlete) => (
                <tr key={athlete.id}>
                  <td className="table-dark">{athlete.nome}</td>
                  <td className="table-dark">{athlete.posicao_primaria}</td>
                  <td className="table-dark">{moment(athlete.data_nascimento).format("DD/MM/YYYY")}</td>
                  <td className="table-dark">{athlete.clube_atual}</td>
                  <td className="table-dark text-end">
                    {/* <FontAwesomeIcon
                      icon={faTrashCan}
                      size="2xl"
                      style={{ color: '#ff0000', cursor: 'pointer' }}
                    /> */}
                    <FontAwesomeIcon
                      className='ms-2 me-2'
                      icon={faFilePdf}
                      style={{ color: "white", cursor: "pointer" }}
                      size="2xl"
                      onClick={() => handleClickPdf(athlete.id)}
                    />
                    <FontAwesomeIcon
                      className='ms-2 me-2'
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
      <div className='d-flex justify-content-center'>
        {totalRow > 10 && (
          <Pagination
            className="pagination-bar"
            count={Math.ceil(totalRow / 10)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            size="large"
            sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}

          />
        )}
      </div>
        <Modal
          open={modalPdfOpen}
          className="d-flex align-items-center justify-content-center"
          onClose={() => setModalPdfOpen(false)}
          style={{ border: "none", outline: "none" }}
        >
          <div
            className={`${loadingPDF ? "d-flex align-items-center justify-content-center" : ""} h-75 `}
            style={{ border: "none", outline: "none" }}
          >
            {loadingPDF ? (
              <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
            ) : (
              <AthletePDF info={atletaInfo!} onLoading={onLoadingPdf} urlFoto={urlFoto} />
            )}
          </div>
        </Modal>
      </div>
     {infoPdf ?  <div
        className="bg-white pointer rounded-2 p-4 mx-auto pdf"
        style={{ cursor: "pointer", width: "95%" }}
        ref={pdfRef}
      >
        <header className="d-flex align-items-center justify-content-center">
          <Image
            objectFit="contain"
            src="/images/logo-fort-house.png"
            alt="Logo Fort House"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 200, height: "auto", maxWidth: "100%" }}
          />
          <h1 className="fw-bold h3  text-dark text-center">Relatório desempenho com atletas representados</h1>
          <Image
            objectFit="contain"
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
            {urlFoto ? (
              <Image
                objectFit="contain"
                src={urlFoto}
                alt="Logo Fort House"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto", maxWidth: "100%" }}
              />
            ) : (
              <Image
                objectFit="contain"
                src="/images/icon-user.png"
                alt="Logo Fort House"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto", maxWidth: "100%" }}
              />
            )}
          </article>
          <article className="col-9">
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2">
                Nome do Atleta: <span className="text-uppercase fw-normal">{infoPdf!.atleta.nome}</span>
              </p>
            </div>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                Posição: <span className="text-uppercase fw-normal">{infoPdf!.atleta.posicao_primaria}</span>
              </p>
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                Data de Nascimento:{" "}
                <span className="text-uppercase fw-normal">
                  {" "}
                  {moment(infoPdf!.atleta.data_nascimento).format("DD/MM/YYYY")}
                </span>
              </p>
              <p className="fw-bold d-flex align-items-center justify-content-between">
                Clube Atual: <span className="text-uppercase fw-normal">{infoPdf!.atleta.clube_atual}</span>
              </p>
            </div>
          </article>
        </section>
        <section className="mt-4">
          <article>
            <div className="border-bottom border-4 border-black mb-3">
              <p className="fw-bold mb-2 text-uppercase h4">PERFIL FÍSICO E TÉCNICO</p>
            </div>

            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th className="" scope="col">
                    Data
                  </th>
                  <th className="" scope="col">
                    Estatura
                  </th>
                  <th className="" scope="col">
                    Envergadura
                  </th>
                  <th className="" scope="col">
                    Peso
                  </th>
                  <th className="" scope="col">
                    Percentual de Gordura
                  </th>
                </tr>
              </thead>
              <tbody>
                {infoPdf!.caracteristicas_fisicas.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td className="">{moment(x.data_criacao).format("DD/MM/YYYY")}</td>
                      <td className="">{x.estatura}</td>
                      <td className="">{x.envergadura}</td>
                      <td className="">{x.peso}</td>
                      <td className="">{x.percentual_gordura}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">PERFIL TÉCNICO DIFERENCIAL</p>
            </div>

            <table className="table" style={{ maxWidth: "100%", width: "100%" }}>
              <thead>
                <tr>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Data
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Est.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Veloci.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    1x1
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Desmarq.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Ctrl de Bola
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Cruzamen.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Finzali.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Vis Espacial.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Dom Orien.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Dribles
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Leit. De Jogo
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Criativi.
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Capac. De Descição
                  </th>
                  <th className="" scope="col" style={{ fontSize: 14 }}>
                    Competividade
                  </th>
                </tr>
              </thead>
              <tbody>
                {infoPdf!.caracteristicas_posicao.map((x, y) => {
                  return (
                    <tr>
                      <td className="">{moment(x.data_criacao).format("DD/MM/YYYY")}</td>
                      <td className="">{x.estatura_fis}</td>
                      <td className="">{x.velocidade_fis}</td>
                      <td className="">{x.um_contra_um_ofensivo_fis}</td>
                      <td className="">{x.desmarques_fis}</td>
                      <td className="">{x.controle_bola_fis}</td>
                      <td className="">{x.cruzamentos_fis}</td>
                      <td className="">{x.finalizacao_fis}</td>
                      <td className="">{x.visao_espacial_tec}</td>
                      <td className="">{x.dominio_orientado_tec}</td>
                      <td className="">{x.dribles_em_diagonal_tec}</td>
                      <td className="">{x.leitura_jogo_tec}</td>
                      <td className="">{x.criatividade_psi}</td>
                      <td className="">{x.capacidade_decisao_psi}</td>
                      <td className="">{x.competitividade_psi}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">Histórico de Lesões </p>
            </div>

            <table className="table" style={{ maxWidth: "100%", width: "100%" }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {infoPdf!.lesao.map((x, i) => {
                  return (
                    <tr>
                      <td>{moment(x.data_lesao).format("DD/MM/YYYY")}</td>
                      <td>{x.descricao}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">Histórico de Clubes </p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td>Date de Inicio</td>
                  <td>Data de Fim</td>
                  <td>Nome</td>
                </tr>
              </thead>
              <tbody>
                {clubes.map((x:any, i) => {
                  return (
                    <tr key={i}>
                      <td>{moment(x.data_inicio).format("DD/MM/YYYY")}</td>
                      <td>{x.data_fim ? moment(x.data_fim).format("DD/MM/YYYY") : "--"}</td>
                      <td>{x.nome}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">Histórico de competição</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td>Nome</td>
                  <td>Gols</td>
                  <td>Jogos Completos</td>
                  <td>Jogos Parciais</td>
                  <td>Minutagem</td>
                </tr>
              </thead>
              <tbody>
                {infoPdf!.competicao.map((x, i) => {
                  return (
                    <tr>
                      <td>{x.nome}</td>
                      <td>{x.gols}</td>
                      <td>{x.jogos_completos}</td>
                      <td>{x.jogos_parciais}</td>
                      <td>{x.minutagem}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">Relacionamento</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <td>Data</td>
                  <td>Receptividade Contrato</td>
                  <td>Satisfação da Empresa</td>
                  <td>Satisfação do Clube</td>
                  <td>Relação Familiares</td>
                  <td>Influências Externas</td>
                  <td>Pendência Empresa</td>
                  <td>Pendência Clube</td>
                </tr>
              </thead>
              <tbody>
                {infoPdf!.relacionamento.map((x, i) => {
                  return (
                    <tr>
                      <td>{x.data_criacao ? moment(x.data_criacao).format("DD/MM/YYYY").toString() : "---"}</td>
                      <td>{x.receptividade_contrato}</td>
                      <td>{x.satisfacao_empresa}</td>
                      <td>{x.satisfacao_clube}</td>
                      <td>{x.relacao_familiares}</td>
                      <td>{x.influencias_externas}</td>
                      <td>{x.pendencia_empresa ? "Sim" : "Não"}</td>
                      <td>{x.pendencia_clube ? "Sim" : "Não"}</td>
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
              <p className="fw-bold mb-2 text-uppercase h4">Observações</p>
            </div>
            {/* <div className="row border-bottom border-2 mb-2 border-gray">
              <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                <textarea
                  disabled
                  className="w-100 bg-white border-black text-black"
                  style={{ resize: "none" }}
                  value={observacaoDesempenho[observacaoDesempenho.length - 1].descricao}
                ></textarea>
              </p>
            </div> */}
          </article>
          {/* <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }} value={}></textarea> */}
        </section>
      </div> : null}
    </>
  );
}
