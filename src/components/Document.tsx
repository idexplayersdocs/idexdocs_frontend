/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, Text, View, Document, Image, Link } from "@react-pdf/renderer";
import {
  Atleta,
  PDFInfoResponseDTO,
} from "@/pages/api/http-service/pdfService/dto";
import { useTranslation } from "react-i18next";
import {
  getPositionName,
  getThumbnail,
  createRows,
} from "@/utils/pdf/pdfReport";
import { styles } from "@/styles/pdfReport";
import { stylesPositions } from "@/styles/pdfReport";
import { PlayerPositionImgProps } from "@/pages/api/http-service/pdfService/types";

// Create PDF Component
const MyDocument = ({ data }: { data: PDFInfoResponseDTO }) => {
  const { t } = useTranslation();
  const HorizontalLine = () => <View style={styles.horizontalLine} />;

  // Creating rows for images and videos using the generic function
  const ITEMS_PER_ROW = 3;
  const rowsForImage = createRows(data.imagens, ITEMS_PER_ROW);
  const rowsForVideo = createRows(data.videos, ITEMS_PER_ROW);

  const PlayerPositionImg: React.FC<PlayerPositionImgProps> = ({
    position,
    type,
  }) => {
    const imageType = type === "primaria" ? "jogador" : "goleiro"; // Primary is "jogador", others are "goleiro"

    // Default to empty object if position isn't found in stylesPositions
    const baseStyle = stylesPositions[position] || {};

    // Override width based on position type
    const updatedStyle = {
      ...baseStyle,
      width: type === "primaria" ? 30 : type === "secundaria" ? 20 : 15,
    };

    return (
      <Image
        source={{ uri: `/images/${imageType}.png` }}
        style={updatedStyle}
      />
    );
  };

  const ParsePosition = (
    position: number,
    t: (key: string) => string
  ): string => {
    return t(getPositionName(position));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image src={"/images/logo-fort-house.png"} style={styles.logo} />
          <Text style={styles.title}>{t("report")}</Text>
          <Image src={"/images/logo-arabe.png"} style={styles.logo} />
        </View>
        <HorizontalLine />
        {/* Athlete info */}
        <View style={styles.athlete}>
          <Image src={data.atleta.blob_url} style={styles.avatar} />
          <View style={styles.sectionAthlete}>
            <Text style={styles.text}>
              {t("name")}: {data.atleta.nome}
            </Text>
            <View style={{gap: 2}}>
              {/* Posição primária */}
              {data.atleta.posicao_primaria != 1 && (
                <Text style={styles.text}>
                  {t("position") + " 1"} :{" "}
                  {ParsePosition(data.atleta.posicao_primaria, t)}
                </Text>
              )}
              {/* Posição secundária */}
              {data.atleta.posicao_secundaria != 1 && (
                <Text style={styles.text}>
                  {t("position") + " 2"} :{" "}
                  {ParsePosition(data.atleta.posicao_secundaria, t)}
                </Text>
              )}
              {/* Posição terciária */}
              {data.atleta.posicao_terciaria != 1 && (
                <Text style={styles.text}>
                  {t("position") + " 3"} :{" "}
                  {ParsePosition(data.atleta.posicao_terciaria, t)}
                </Text>
              )}
            </View>
            <Text style={styles.text}>
              {t("birthdate")}: {data.atleta.data_nascimento}
            </Text>
            <Text style={styles.text}>
              {t("currentClub")}: {data.atleta.clube_atual ? data.atleta.clube_atual : t("noCurrentClub")}
            </Text>
          </View>
          <Image src={"/images/campo.png"} style={styles.field} />
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
        </View>
        <HorizontalLine />
        {/* Histórico Físico */}
        <View style={styles.section}>
          <Text style={styles.tableTitle}>{t("physicalHistory")}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>{t("date")}</Text>
              <Text style={styles.cell}>{t("height")}</Text>
              <Text style={styles.cell}>{t("wingspan")}</Text>
              <Text style={styles.cell}>{t("weight")}</Text>
              <Text style={styles.cell}>{t("fatPercentage")}</Text>
            </View>
            {data.caracteristicas_fisicas.map((item, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{item.data_avaliacao}</Text>
                <Text style={styles.cell}>{item.estatura}</Text>
                <Text style={styles.cell}>{item.envergadura}</Text>
                <Text style={styles.cell}>{item.peso}</Text>
                <Text style={styles.cell}>{item.percentual_gordura}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Histórico de Competições */}
        <View style={styles.section}>
          <Text style={styles.tableTitle}>{t("competitionHistory")}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>{t("date")}</Text>
              <Text style={styles.cell}>{t("competition")} </Text>
              <Text style={styles.cell}>{t("fullGames")}</Text>
              <Text style={styles.cell}>{t("goals")}</Text>
              <Text style={styles.cell}>{t("assists")}</Text>
            </View>
            {data.competicao.map((comp, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{comp.data_competicao}</Text>
                <Text style={styles.cell}>{comp.nome}</Text>
                <Text style={styles.cell}>{comp.jogos_completos}</Text>
                <Text style={styles.cell}>{comp.gols}</Text>
                <Text style={styles.cell}>{comp.assistencias}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Histórico de Clubes */}
        <View style={styles.section}>
          <Text style={styles.tableTitle}>{t("clubHistory")}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>{t("club")}</Text>
              <Text style={styles.cell}>{t("startDate")}</Text>
              <Text style={styles.cell}>{t("endDate")}</Text>
            </View>
            {data.clube.map((clube, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{clube.nome}</Text>
                <Text style={styles.cell}>{clube.data_inicio}</Text>
                <Text style={styles.cell}>{clube.data_fim}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Verifica se existem vídeos a cria uma página caso existirem */}
        {rowsForVideo.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.tableTitle}>{t("videos")}</Text>
            {rowsForVideo.map((row, rowVideoIndex) => (
              <View key={rowVideoIndex} style={styles.rowImage}>
                {row.map((video, colIndex) => (
                  <View key={colIndex} style={styles.imageContainer}>
                    <Image
                      src={getThumbnail(video.blob_url)}
                      style={styles.thumbnail}
                    />
                    <Text style={styles.text}>{video.descricao}</Text>
                    <Link src={video.blob_url} style={styles.text}>
                      {video.tipo === "youtube" ? t("watchOnYouTube") : t("downloadTowatch")}
                    </Link>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {/* Verifica se existem imagens a cria uma página caso existirem */}
        {rowsForImage.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.tableTitle}>{t("images")}</Text>
            {rowsForImage.map((row, rowImageIndex) => (
              <View key={rowImageIndex} style={styles.rowImage}>
                {row.map((img, colIndex) => (
                  <View key={colIndex} style={styles.imageContainer}>
                    <Image src={img.blob_url} style={styles.image} />
                    <Text style={styles.text}>{img.descricao}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Build Stars</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
