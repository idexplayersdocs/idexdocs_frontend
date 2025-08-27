import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { getAthletes } from "@/pages/api/http-service/athletes";
import Loading from "react-loading";
import moment from "moment";
import {
  faCheck,
  faEye,
  faFilePdf,
  faTriangleExclamation,
  faFileText,
  faXmark,
  faCopy,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  Typography,
} from "@mui/material";
import styles from "../styles/Login.module.css";

import { jwtDecode } from "jwt-decode";

import { PDFInfo } from "@/pages/api/http-service/pdfService";

import MyDocument from "./Document";
import { pdf } from "@react-pdf/renderer";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Subtitle from "./Subtitle";
import { useTranslation } from "react-i18next";

interface Athlete {
  id: number;
  nome: string;
  posicao_primaria: string;
  data_nascimento: string;
  clube_atual: string;
  data_proxima_avaliacao_relacionamento: any;
  ativo: boolean;
}

const modalStyle = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: 380, sm: 380, md: 600 },
    bgcolor: "var(--bg-primary-color)",
    border: "2px solid var(--color-line)",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  },
  body: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnsDesktop: {
    display: { xs: "none", sm: "none", md: "flex" },
  },
  dropdownBtn: {
    display: { xs: "flex", sm: "flex", md: "none" },
  },
};

export default function AthletesList({
  newAthlete,
  inputFilter,
  searchFilter,
}: any) {
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const { push } = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalRow, setTotalRow]: any = useState();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [infoPdf, setInfoPdf] = useState<any>();
  const btnPdfRef = useRef<any>();
  const router = useRouter();
  const [permissions, setPermissions] = useState<any>({
    relationship: false,
    performance: false,
  });
  const [athleteToShow, setAthleteToShow] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    if (token) {
      setPermissions({
        relationship: decoded.permissions.includes("create_relacionamento"),
        performance: decoded.permissions.includes("create_desempenho"),
      });
    }
  }, []);

  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athletesData = await getAthletes(page);
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
      } catch (error: any) {
        console.error("Error fetching athletes:", error);
        if (error.response.status == 401) {
          window.localStorage.removeItem("token");
          router.push("/public/login");
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

  const handleClick = () => {
    // Função principal ao clicar no botão
    console.log("Botão principal clicado");
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option: string) => {
    console.log(`Opção selecionada: ${option}`);
    handleClose();
  };

  const handleEditAthlete = (id: number) => {
    push(`/secure/athletes/${id}/athleteDetail`);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  // Define generatePdf function with useCallback to avoid redeclaration
  const generatePdf = useCallback(async () => {
    try {
      const pdfBlob = await pdf(<MyDocument data={infoPdf} />).toBlob();
      // Create a download link and trigger click event
      const url = URL.createObjectURL(pdfBlob);
      // Generate a dynamic filename with timestamp
      const fileName = `${infoPdf.atleta.nome} - ${new Date().getTime()}`;
      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  }, [infoPdf, setIsLoading]);

  useEffect(() => {
    if (infoPdf) {
      generatePdf(); // Call generatePdf when infoPdf changes
    }
  }, [infoPdf, generatePdf]);

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

  const handleClickAthleteReport = async (id: number) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const code = btoa(`${id}-YKhZ-PhhZ-*TKAJ`);

    setAthleteToShow(
      `${protocol}//${host}/public/athlete-report/${code}?lang=${i18n.language}`
    );
  };

  const validLabelDate = (dataAvaliacao: string) => {
    const currentDate = moment().startOf("day");
    const nextEvaluationDate = moment(dataAvaliacao).startOf("day");
    return currentDate.isAfter(nextEvaluationDate);
  };

  // FILTRO DE ATLETA
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

  const copyToClipboard = () => {
    if (athleteToShow) {
      navigator.clipboard.writeText(athleteToShow);
      toast.success(
        "Relatório do atleta copiado para a área de transferência."
      );
    }
  };

  const openAthleteReport = () => {
    if (athleteToShow) {
      window.open(athleteToShow, "_blank");
    }
  };

  const downloadPdf = () => {
    const hash = athleteToShow?.split("/").pop()?.replace("?lang=pt", "");

    if (hash) {
      const decoded = atob(hash).split("-YKhZ-PhhZ-*TKAJ")[0];

      handleClickPdf(Number(decoded));
    } else {
      toast.error("Erro ao baixar PDF");
    }
  };

  return (
    <>
      {/* LISTAGEM DE ATLETA*/}
      <ToastContainer />
      <Modal
        open={athleteToShow !== null}
        onClose={() => setAthleteToShow(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle.wrapper}>
          <Box sx={modalStyle.row}>
            <Subtitle subtitle="Compartilhe o link do atleta" />
            <IconButton onClick={() => setAthleteToShow(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
          <hr />

          <Box sx={modalStyle.body}>
            <input
              type="text"
              value={athleteToShow || ""}
              onChange={(e) => setAthleteToShow(e.target.value)}
              style={{ width: "100%" }}
              className="form-control input-create input-date bg-dark-custom"
            />
          </Box>

          <Box sx={modalStyle.row}>
            <Button
              sx={modalStyle.btnsDesktop}
              variant="contained"
              color="secondary"
              onClick={() => openAthleteReport()}
            >
              <Box sx={modalStyle.row}>
                <FontAwesomeIcon icon={faEye} />
                {` `} Visualizar
              </Box>
            </Button>

            <Button
              sx={modalStyle.btnsDesktop}
              variant="contained"
              color="success"
              onClick={() => downloadPdf()}
            >
              <Box sx={modalStyle.row}>
                <FontAwesomeIcon icon={faFilePdf} />
                {` `} Baixar PDF
              </Box>
            </Button>

            <Button
              sx={modalStyle.btnsDesktop}
              variant="contained"
              color="primary"
              onClick={copyToClipboard}
            >
              <Box sx={modalStyle.row}>
                <FontAwesomeIcon icon={faCopy} />
                {` `} Copiar Link
              </Box>
            </Button>

            <Box sx={modalStyle.dropdownBtn}></Box>

            <ButtonGroup variant="contained" sx={modalStyle.dropdownBtn}>
              <Button onClick={copyToClipboard}>
                <Box sx={modalStyle.row}>
                  <FontAwesomeIcon icon={faCopy} />
                  {` `} Copiar Link
                </Box>
              </Button>
              <Button
                size="small"
                aria-controls={anchorEl ? "split-button-menu" : undefined}
                aria-haspopup="menu"
                aria-expanded={anchorEl ? "true" : undefined}
                onClick={handleMenuClick}
              >
                <FontAwesomeIcon
                  icon={Boolean(anchorEl) ? faChevronRight : faChevronDown}
                />
              </Button>
              <Menu
                id="split-button-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => openAthleteReport()}>
                  <Box sx={modalStyle.row}>
                    <FontAwesomeIcon icon={faEye} />
                    {` `} Visualizar
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => downloadPdf()}>
                  <Box sx={modalStyle.row}>
                    <FontAwesomeIcon icon={faFilePdf} />
                    {` `} Baixar PDF
                  </Box>
                </MenuItem>
              </Menu>
            </ButtonGroup>
          </Box>
        </Box>
      </Modal>
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
                    <td className="table-dark text-center">
                      {athlete.posicao_primaria}
                    </td>
                    <td className="table-dark text-center">
                      {moment(athlete.data_nascimento).format("DD/MM/YYYY")}
                    </td>
                    <td className="table-dark text-center">
                      {athlete.clube_atual}
                    </td>
                    <td
                      className={`table-dark text-center ${
                        validLabelDate(
                          athlete.data_proxima_avaliacao_relacionamento
                        )
                          ? "text-danger"
                          : ""
                      }`}
                    >
                      {athlete.data_proxima_avaliacao_relacionamento
                        ? moment(
                            athlete.data_proxima_avaliacao_relacionamento
                          ).format("DD/MM/YYYY")
                        : "Não Avaliado"}
                      {validLabelDate(
                        athlete.data_proxima_avaliacao_relacionamento
                      ) && (
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
                        style={
                          athlete.ativo
                            ? { color: "#15ff00" }
                            : { color: "#ff0000" }
                        }
                      />
                    </td>
                    <td
                      className="table-dark text-end"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {/* <FontAwesomeIcon
                      icon={faTrashCan}
                      size="2xl"
                      style={{ color: '#ff0000', cursor: 'pointer' }}
                    /> */}
                      <div
                        onClick={() => handleClickAthleteReport(athlete.id)}
                        ref={btnPdfRef}
                        style={{ display: "inline-block" }}
                      >
                        <FontAwesomeIcon
                          className="ms-2 me-2"
                          icon={faFileText}
                          style={{ color: "white", cursor: "pointer" }}
                          size="2xl"
                        />
                      </div>

                      <FontAwesomeIcon
                        className="ms-2 me-2"
                        icon={faEye}
                        size="2xl"
                        style={{
                          color: "#ffffff",
                          cursor: "pointer",
                          display: "inline-block",
                        }}
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
    </>
  );
}
