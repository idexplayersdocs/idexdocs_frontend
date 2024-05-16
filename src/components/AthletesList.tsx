import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import Loading from 'react-loading';
import moment from 'moment';
import { faEye, faFilePdf, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Pagination, Modal } from "@mui/material";

import Image from "next/image";

import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import AthletePDF from './AthletePDF';
import styles from '@/styles/css/pagination.module.css';


interface Athlete {
  id: number;
  nome: string;
  posicao_primaria: string;
  data_nascimento: string;
  clube_atual: string;
  data_proxima_avaliacao_relacionamento: any
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
      setAtletaInfo(res);
      setModalPdfOpen(true);
    } catch (e: unknown) {
    } finally {
      setLoading(false);
    }
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
    const currentDate = moment().startOf('day');
    const nextEvaluationDate = moment(dataAvaliacao).startOf('day');
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "150px" }}>
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      </div>
    );
  }

  return (
    <>
      <div className="m-3" style={{overflow: 'auto'}}>
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
              <th className="table-dark text-center"></th>
            </tr>
          </thead>
          <tbody>
            {athletes.length > 0 ? (
              athletes.map((athlete) => (
                <tr key={athlete.id}>
                  <td className="table-dark text-center">{athlete.nome}</td>
                  <td className="table-dark text-center">{athlete.posicao_primaria}</td>
                  <td className="table-dark text-center">
                    {moment(athlete.data_nascimento).format('DD/MM/YYYY')}
                  </td>
                  <td className="table-dark text-center">{athlete.clube_atual}</td>
                  <td className={`table-dark text-center ${validLabelDate(athlete.data_proxima_avaliacao_relacionamento) ? 'text-danger' : ''}`} >{athlete.data_proxima_avaliacao_relacionamento ? moment(athlete.data_proxima_avaliacao_relacionamento).format('DD/MM/YYYY') : 'Não Avaliado'}
                  {
                    validLabelDate(athlete.data_proxima_avaliacao_relacionamento) &&
                      <FontAwesomeIcon className='ms-2 mt-1' icon={faTriangleExclamation} style={{color: "#ff0000",}} />
                  }
                  </td>
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
          <div className={`${loadingPDF ? "d-flex align-items-center justify-content-center" : "overflow-y-scroll"} h-75 `} style={{ border: "none", outline: "none" }}>
            {loadingPDF ? (
              <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
            ) : (
              <AthletePDF info={atletaInfo!} onLoading={onLoadingPdf} />
            )}
          </div>
        </Modal>
    </>
  );
}
