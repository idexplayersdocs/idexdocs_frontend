import React, { useEffect } from "react";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  getPositionName,
  getThumbnail,
  createRows,
} from "@/utils/pdf/pdfReport";
import styles from "@/styles/DocumentReport.module.css";
import YouTube from "./YouTube";
import { useRouter } from "next/router";

// Criando o componente HTML equivalente ao PDF
const MyDocumentReport = ({ data }: { data: PDFInfoResponseDTO }) => {
  // query string param
  const { query } = useRouter();
  const { t, i18n } = useTranslation();
  const HorizontalLine = () => <div className={styles["horizontal-line"]} />;

  useEffect(() => {
    if (query.lang && typeof query.lang === "string") {
      i18n.changeLanguage(query.lang);
    }
  }, [query.lang, i18n]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(i18n.language || "pt-BR").format(
      new Date(date)
    );
  };

  // Criando linhas para imagens e vídeos usando a função genérica
  const ITEMS_PER_ROW = 3;
  const rowsForImage = createRows(data.imagens, ITEMS_PER_ROW);
  const rowsForVideo = createRows(data.videos, ITEMS_PER_ROW);

  // Definição de posições no campo
  const positionStyles: Record<string, { top: string; left: string }> = {
    goleiro: { top: "70%", left: "50%" },
    lateral_direito: { top: "70%", left: "80%" },
    lateral_esquerdo: { top: "70%", left: "20%" },
    zagueiro: { top: "60%", left: "50%" },
    volante: { top: "50%", left: "50%" },
    meia_armador: { top: "40%", left: "50%" },
    meia_atacante: { top: "20%", left: "50%" },
    atacante: { top: "15%", left: "50%" },
    centroavante: { top: "20%", left: "50%" },
    extremo_direito: { top: "20%", left: "70%" },
    extremo_esquerdo: { top: "20%", left: "30%" },
  };

  const PlayerPositionImg = ({
    position,
    type,
  }: {
    position: string;
    type: "primaria" | "secundaria" | "terciaria";
  }) => {
    const imageType = type === "primaria" ? "jogador" : "goleiro";
    const width = type === "primaria" ? 30 : type === "secundaria" ? 20 : 15;
    const posStyle = positionStyles[position] || { top: "50%", left: "50%" };

    return (
      <div
        style={{
          position: "absolute" as const,
          top: posStyle.top,
          left: posStyle.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src={`/images/${imageType}.png`}
          width={width}
          height={width}
          alt={`Posição ${position}`}
        />
      </div>
    );
  };

  const ParsePosition = (
    position: number,
    t: (key: string) => string
  ): string => {
    return t(getPositionName(position));
  };

  return (
    <div className={styles["document-container"]}>
      {/* Header */}
      <div className={styles["header-container"]}>
        <Image
          src="/images/logo-fort-house.png"
          width={100}
          height={50}
          className={styles.logo}
          alt="Logo Fort House"
        />
        <h1 className={styles.title}>{t("report")}</h1>
        <Image
          src="/images/logo-arabe.png"
          width={100}
          height={50}
          className={styles.logo}
          alt="Logo Arabe"
        />
      </div>
      <HorizontalLine />

      {/* Athlete info */}
      <div className={styles["athlete-section"]}>
        <div className={styles["avatar-container"]}>
          {/* Usando um div como contêiner para a imagem do atleta */}
          <Image
            src={data.atleta.blob_url}
            width={150}
            height={150}
            className={styles.avatar}
            alt="Foto do Atleta"
          />
        </div>
        <div className={styles["athlete-info"]}>
          <p className={styles.text}>
            <strong>{t("name")}:</strong> {data.atleta.nome}
          </p>
          <div className={styles["positions-container"]}>
            {/* Posição primária */}
            {data.atleta.posicao_primaria != 1 && (
              <p className={styles.text}>
                <strong>{t("position") + " 1"}:</strong>{" "}
                {ParsePosition(data.atleta.posicao_primaria, t)}
              </p>
            )}
            {/* Posição secundária */}
            {data.atleta.posicao_secundaria != 1 && (
              <p className={styles.text}>
                <strong>{t("position") + " 2"}:</strong>{" "}
                {ParsePosition(data.atleta.posicao_secundaria, t)}
              </p>
            )}
            {/* Posição terciária */}
            {data.atleta.posicao_terciaria != 1 && (
              <p className={styles.text}>
                <strong>{t("position") + " 3"}:</strong>{" "}
                {ParsePosition(data.atleta.posicao_terciaria, t)}
              </p>
            )}
          </div>
          <p className={styles.text}>
            <strong>{t("birthdate")}:</strong>{" "}
            {formatDate(data.atleta.data_nascimento)}
          </p>
          <p className={styles.text}>
            <strong>{t("currentClub")}:</strong>{" "}
            {data.atleta.clube_atual
              ? data.atleta.clube_atual
              : t("noCurrentClub")}
          </p>
        </div>

        {/* Campo de futebol com posições */}
        <div
          className={styles["field-container"]}
          style={{ position: "relative" }}
        >
          <Image
            src="/images/campo.png"
            width={300}
            height={400}
            className={styles.field}
            alt="Campo de futebol"
          />
          {getPositionName(data.atleta.posicao_primaria) && (
            <PlayerPositionImg
              position={getPositionName(data.atleta.posicao_primaria)}
              type="primaria"
            />
          )}
          {getPositionName(data.atleta.posicao_secundaria) && (
            <PlayerPositionImg
              position={getPositionName(data.atleta.posicao_secundaria)}
              type="secundaria"
            />
          )}
          {getPositionName(data.atleta.posicao_terciaria) && (
            <PlayerPositionImg
              position={getPositionName(data.atleta.posicao_terciaria)}
              type="terciaria"
            />
          )}
        </div>
      </div>
      <HorizontalLine />

      {/* Histórico Físico */}
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t("physicalHistory")}</h2>
        <div className={styles["table-container"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("height")}</th>
                <th>{t("wingspan")}</th>
                <th>{t("weight")}</th>
                <th>{t("fatPercentage")}</th>
              </tr>
            </thead>
            <tbody>
              {data.caracteristicas_fisicas.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.data_avaliacao)}</td>
                  <td>{item.estatura}</td>
                  <td>{item.envergadura}</td>
                  <td>{item.peso}</td>
                  <td>{item.percentual_gordura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Competições */}
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t("competitionHistory")}</h2>
        <div className={styles["table-container"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("competition")}</th>
                <th>{t("fullGames")}</th>
                <th>{t("partialGames")}</th>
                <th>{t("timePlayed")}</th>
                <th>{t("goals")}</th>
                <th>{t("assists")}</th>
              </tr>
            </thead>
            <tbody>
              {data.competicao.map((comp, index) => (
                <tr key={index}>
                  <td>{formatDate(comp.data_competicao)}</td>
                  <td>{comp.nome}</td>
                  <td>{comp.jogos_completos}</td>
                  <td>{comp.jogos_parciais}</td>
                  <td>{comp.minutagem}</td>
                  <td>{comp.gols}</td>
                  <td>{comp.assistencias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Clubes */}
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t("clubHistory")}</h2>
        <div className={styles["table-container"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>{t("club")}</th>
                <th>{t("startDate")}</th>
                <th>{t("endDate")}</th>
              </tr>
            </thead>
            <tbody>
              {data.clube.map((clube, index) => (
                <tr key={index}>
                  <td>{clube.nome}</td>
                  <td>{formatDate(clube.data_inicio)}</td>
                  <td>
                    {clube.data_fim
                      ? formatDate(clube.data_fim)
                      : "Em andamento"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vídeos */}
      {rowsForVideo.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles["section-title"]}>{t("videos")}</h2>
          {rowsForVideo.map((row, rowVideoIndex) => (
            <div key={rowVideoIndex} className={styles["media-row"]}>
              {row.map((video, colIndex) => (
                <div key={colIndex} className={styles["media-container"]}>
                  <div className={styles["video-thumbnail"]}>
                    {video.tipo === "youtube" ? (
                      <YouTube url={video.blob_url} />
                    ) : (
                      <Image
                        src={getThumbnail(video.blob_url)}
                        width={200}
                        height={150}
                        className={styles.thumbnail}
                        alt={video.descricao || "Thumbnail do vídeo"}
                      />
                    )}
                  </div>
                  <p className={styles["media-description"]}>
                    {video.descricao}
                  </p>
                  <a
                    href={video.blob_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["video-link"]}
                  >
                    {video.tipo === "youtube"
                      ? t("watchOnYouTube")
                      : t("downloadTowatch")}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Imagens */}
      {rowsForImage.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles["section-title"]}>{t("images")}</h2>
          {rowsForImage.map((row, rowImageIndex) => (
            <div key={rowImageIndex} className={styles["media-row"]}>
              {row.map((img, colIndex) => (
                <div key={colIndex} className={styles["media-container"]}>
                  <Image
                    src={img.blob_url}
                    width={200}
                    height={150}
                    className={styles.image}
                    alt={img.descricao || "Imagem do atleta"}
                  />
                  <p className={styles["media-description"]}>{img.descricao}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Links */}
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>Links</h2>
        <div className={styles["table-container"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.links.map((link, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {link.descricao ? link.descricao : "Sem descrição"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>Build Stars</p>
      </div>
    </div>
  );
};

export default MyDocumentReport;
