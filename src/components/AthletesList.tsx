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
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@mui/material";
import styles from "../styles/Login.module.css";
import { jwtDecode } from "jwt-decode";

import { PDFInfo } from "@/pages/api/http-service/pdfService";

import MyDocument from "./Document";
import { pdf } from "@react-pdf/renderer";

interface Athlete {
  id: number;
  nome: string;
  posicao_primaria: string;
  data_nascimento: string;
  clube_atual: string;
  data_proxima_avaliacao_relacionamento: any;
  ativo: boolean;
}

export default function AthletesList({
  newAthlete,
  inputFilter,
  searchFilter,
}: any) {
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

  return (
    <>
      {/* LISTAGEM DE ATLETA*/}
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
                        onClick={() => handleClickPdf(athlete.id)}
                        ref={btnPdfRef}
                        style={{ display: "inline-block" }}
                      >
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
