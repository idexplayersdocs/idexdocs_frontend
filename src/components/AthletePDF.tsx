import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import Image from "next/image";
import React from "react";
import generatePDF, { Margin, Options } from "react-to-pdf";
import { LoadingOverlay } from "./LoadingOverley";
import Loading from "react-loading";

const options: Options = {
  // default is `save`
  method: "open",
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
  // so use with caution.
};

type AthletaInfo = {
  info: PDFInfoResponseDTO;
  onLoading: (isLoading: boolean) => void;
};

export default function AthletePDF({ info, onLoading }: AthletaInfo) {
  const pdfRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onClickPDF = async (): Promise<void> => {
    setIsLoading(true);
    onLoading(true);
    try {
      await generatePDF(pdfRef, options);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  const observacoesDesempenho = info.observacao.filter((x) => x.tipo === "desempenho");

  return (
    <>
      {isLoading ? (
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      ) : (
        <div
          className="bg-white pointer rounded-2 p-4 mx-auto overflow-scroll"
          style={{ cursor: "pointer", width: "95%", maxHeight: "100%"}}
          onClick={() => onClickPDF()}
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
              <Image
                objectFit="contain"
                src="/images/icon-user.png"
                alt="Logo Fort House"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto", maxWidth: "100%" }}
              />
            </article>
            <article className="col-9 ">
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2">
                  Nome do Atleta: <span className="text-uppercase fw-normal">{info.atleta.nome}</span>
                </p>
              </div>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                  Posição: <span className="text-uppercase fw-normal">{info.atleta.posicao_primaria}</span>
                </p>
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                  Data de Nascimento: <span className="text-uppercase fw-normal">{info.atleta.data_nascimento}</span>
                </p>
                <p className="fw-bold d-flex align-items-center justify-content-between">
                  Clube Atual: <span className="text-uppercase fw-normal">{info.atleta.clube_atual}</span>
                </p>
              </div>
              <div>
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                  Competiçãoes andamento: <span className="text-uppercase fw-normal">Copa SP 2024</span>
                </p>
              </div>
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">
                  Características Físicas ({info.atleta.posicao_primaria})
                </p>
              </div>
              {info.caracteristicas_fisicas.map((x, i) => {
                return (
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
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
                        <th className="" scope="col">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="">{x.estatura}</td>
                        <td className="">{x.envergadura}</td>
                        <td className="">{x.peso}</td>
                        <td className="">{x.percentual_gordura}</td>
                        <td className="">{x.data_criacao}</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })}
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">
                  Características da Posição ({info.atleta.posicao_primaria})
                </p>
              </div>
              {info.caracteristicas_posicao.map((x, i) => {
                return (
                  <table className="table" style={{maxWidth: "100%", width: "100%"}}>
                    <thead>
                      <tr>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Est.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Veloci.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          1x1
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Desmarq.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Ctrl de Bola
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Cruzamen.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Finzali.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Vis Espacial.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Dom Orien.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Dribles
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Leit. De Jogo
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Criativi.
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Capac. De Descição
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Competividade
                        </th>
                        <th className="" scope="col" style={{fontSize: 14}}>
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
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
                        <td className="">{x.data_criacao}</td>
                      </tr>
                    </tbody>
                  </table>
                  // <div className="row" key={i}>
                  //   <div className="col-12 d-flex align-items-end flex-wrap mt-5">
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Estatura:
                  //       <span className="fw-normal">{x.estatura}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Velocidade:
                  //       <span className="fw-normal">{x.velocidade}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Um Contra um ofenviso:
                  //       <span className="fw-normal">{x.um_contra_um_ofensivo}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Desmarques:
                  //       <span className="fw-normal">{x.desmarques}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Controle de Bola:
                  //       <span className="fw-normal">{x.controle_bola}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Cruzamentos:
                  //       <span className="fw-normal">{x.cruzamentos}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Finzaliação:
                  //       <span className="fw-normal">{x.finalizacao}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Visão Espacial:
                  //       <span className="fw-normal">{x.visao_espacial}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Domínio Orientado:
                  //       <span className="fw-normal">{x.dominio_orientado}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Dribles em Diagonal:
                  //       <span className="fw-normal">{x.dribles_em_diagonal}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Leitura de Jogo:
                  //       <span className="fw-normal">{x.leitura_jogo}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Reação pós Perda:
                  //       <span className="fw-normal">{x.reacao_pos_perda}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Criatividade:
                  //       <span className="fw-normal">{x.criatividade}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Capacidade de descição:
                  //       <span className="fw-normal">{x.capacidade_decisao}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Inteligência Tática:
                  //       <span className="fw-normal">{x.inteligencia_tatica}</span>
                  //     </p>
                  //     <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  //       Competitividade:
                  //       <span className="fw-normal">{x.competitividade}</span>
                  //     </p>
                  //   </div>
                  // </div>
                );
              })}
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Histórico de Lesões ({info.atleta.posicao_primaria})</p>
              </div>
              {info.lesao.map((x, i) => {
                return (
                  <div className="row" key={i}>
                    <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                      Descrição:
                      <span className="fw-normal">
                        {" "}
                        {x.data_lesao} - {x.descricao}
                      </span>
                    </p>
                  </div>
                );
              })}
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Histórico de Clubes ({info.atleta.posicao_primaria})</p>
              </div>
              {info.clube.map((x, i) => {
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
              })}
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Histórico de competição ({info.atleta.posicao_primaria})</p>
              </div>
              {info.clube.map((x, i) => {
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
              })}
            </article>
          </section>
          <section className="mt-5">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Observações</p>
              </div>
              {observacoesDesempenho.map((x, i) => {
                return (
                  <div className="row border-bottom border-2 mb-2 border-gray" key={i}>
                    <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                      <textarea
                        disabled
                        className="w-100 bg-white border-black text-black"
                        style={{ resize: "none" }}
                        value={x.descricao}
                      ></textarea>
                    </p>
                  </div>
                );
              })}
            </article>
            {/* <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }} value={}></textarea> */}
          </section>
        </div>
      )}
    </>
  );
}
