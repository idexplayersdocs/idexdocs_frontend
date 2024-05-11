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
    format: "A4",
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
    try{
      await generatePDF(pdfRef, options)
    }finally{
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      ) : (
        <div
          className="bg-white pointer rounded-2 p-4 mx-auto"
          style={{ cursor: "pointer", maxWidth: "1200px", width: "80%" }}
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
                  Clube: <span className="text-uppercase fw-normal">{info.atleta.clube_atual}</span>
                </p>
              </div>
              <div>
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2">
                  Competiçãoes andamento: <span className="text-uppercase fw-normal">Copa SP 2024</span>
                </p>
                <p className="fw-bold mb-2">Histórico de competições:</p>
                <div className="border border-black rounded px-2 py-4 d-flex flex-wrap align-items-center justify-content-strat">
                  {info.competicao.map((x, i) => {
                    return (
                      <p className="me-2" key={i}>
                        {x.nome}
                      </p>
                    );
                  })}
                </div>
              </div>
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">
                  Características Físicas e Técnicas ({info.atleta.posicao_primaria})
                </p>
              </div>
              <div className="row">
                <div className="col-8 d-flex align-items-end flex-wrap mt-5">
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Estatura/Maturação:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Velogicade:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Leitura de jogo/Cobertura ofensiva/contenção:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Desmarques/mobilidade:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Controle de bola/passe para gol:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Capacidade aeróbica:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Finalização:
                  </p>
                </div>
                <div className="col-4 d-flex align-items-start justify-content-center">
                  <div className="">
                    <p className="fw-bold text-uppercase">Aval. Incial</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                  <div className="border border-3 mx-3 h-100 border-black rounded"></div>
                  <div className="">
                    <p className="fw-bold text-uppercase">Projeção</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                </div>
              </div>
              <div className="ms-4 border border-black w-25 rounded p-2">
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  Total:
                </p>
                <p className="fw-bold d-flex align-items-center justify-content-between  mb-0 text-uppercase w-100">
                  Média:
                </p>
              </div>
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">
                  Características Técnias Diferencias ({info.atleta.posicao_primaria})
                </p>
              </div>
              <div className="row">
                <div className="col-8 d-flex align-items-end flex-wrap mt-5">
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Visão Espacial:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Dribles:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Organização Acções Onfesivas/Dinâmica:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Pisada na Área para finalizar/penetração
                  </p>
                </div>
                <div className="col-4 d-flex align-items-start justify-content-center">
                  <div className="">
                    <p className="fw-bold text-uppercase">Aval. Incial</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                  <div className="border border-3 mx-3 h-100 border-black rounded"></div>
                  <div className="">
                    <p className="fw-bold text-uppercase">Projeção</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                </div>
              </div>
              <div className="ms-4 border border-black w-25 rounded p-2">
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  Total:
                </p>
                <p className="fw-bold d-flex align-items-center justify-content-between  mb-0 text-uppercase w-100">
                  Média:
                </p>
              </div>
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Perfil Psicológico ({info.atleta.posicao_primaria})</p>
              </div>
              <div className="row">
                <div className="col-8 d-flex align-items-end flex-wrap mt-5">
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Criativade e improvisação:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Capacidade de decisão:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Confiança/Responsabilidade:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Inteligência Tática/Intuição antecipar ações:
                  </p>
                  <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                    Competividade/Coragem/Concentração
                  </p>
                </div>
                <div className="col-4 d-flex align-items-start justify-content-center">
                  <div className="">
                    <p className="fw-bold text-uppercase">Aval. Incial</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                  <div className="border border-3 mx-3 h-100 border-black rounded"></div>
                  <div className="">
                    <p className="fw-bold text-uppercase">Projeção</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                    <p className="text-center mb-1">OK</p>
                  </div>
                </div>
              </div>
              <div className="ms-4 border border-black w-25 rounded p-2">
                <p className="fw-bold d-flex align-items-center justify-content-between mb-2 text-uppercase w-100">
                  Total:
                </p>
                <p className="fw-bold d-flex align-items-center justify-content-between  mb-0 text-uppercase w-100">
                  Média:
                </p>
              </div>
            </article>
          </section>
          <section className="mt-4">
            <article>
              <div className="border-bottom border-4 border-black mb-3">
                <p className="fw-bold mb-2 text-uppercase h4">Avaliação Final (Média das médias)</p>
              </div>
              <p className="text-uppercase">Ações para avaliação final relativa aos dados de projeção:</p>
              <div className="border border-black w-75 rounded p-1">
                <p className="mb-1 fw-bold">AF 1 é relativo a ateltas com baixa perspectiva futura</p>
                <p className="mb-1 fw-bold">AF 1 é relativo a ateltas com baixa perspectiva futura</p>
                <p className="mb-1 fw-bold">AF 1 é relativo a ateltas com baixa perspectiva futura</p>
                <p className="mb-1 fw-bold">AF 1 é relativo a ateltas com baixa perspectiva futura</p>
              </div>
            </article>
          </section>
          <section className="mt-5">
            <p className="fw-bold text-uppercase"> Observações</p>
            <textarea disabled className="w-100 bg-white border-black " style={{ resize: "none" }}></textarea>
          </section>
        </div>
      )}
    </>
  );
}
