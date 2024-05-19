import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faPenSquare, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createInjuries, getInjuries } from '@/pages/api/http-service/injuries';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { createContract, getContract, getContractVersion } from '@/pages/api/http-service/contract';

interface Athlete {
  id: number;
  nome: string;
  posicao: string;
  data_nascimento: string;
  clube_atual: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto'
};

export default function ContractHistoryVersion({contractId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [openRegisterContractHistoryVersion, setOpenRegisterContractHistoryVersion] = useState(false);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [contractHistoryVersion, setContractHistoryVersion] = useState<any>({
    versao: '',
    data_inicio: '',
    data_termino: '',
    observacao: '',
  });
  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true)
        try {
          const contractHistoryVersionList = await getContractVersion(contractId, page);
          setContractHistoryVersion(contractHistoryVersionList?.data);
          setTotalRow(contractHistoryVersionList?.total);
        } catch (error:any) {
          console.error('Error:', error);
          // toast.error(error.response.data.errors[0].message, {
          //   position: "top-center",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "dark",
          //   transition: Bounce,
          //   });
        } finally {
          setLoading(false)

        }
      };
      fetchAthletesData();
    }
  }, [contractId, page]);

  const handleOpenRegisterContractHistoryVersion = () => setOpenRegisterContractHistoryVersion(true);
  const handleCloseRegisterContractHistory = () => setOpenRegisterContractHistoryVersion(false);

  const handleChangePageContractHistoryVersion = (event: any, newPage:number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: '150px' }}>
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      </div>
    );
  }

  return (
    <>  
      <div className="" style={{overflow: 'auto'}}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Versão</th>
              <th className="table-dark text-center" scope="col">Observação</th>
              <th className="table-dark text-center" scope="col">Data Início</th>
              <th className="table-dark text-center" scope="col">Data Término</th>
            </tr>
          </thead>
          <tbody>
            {
              contractHistoryVersion.length > 0 ? (
                Array.isArray(contractHistoryVersion) && contractHistoryVersion.map((contract, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{contract.versao}</td>
                    <td className="table-dark text-center">{contract.observacao}</td>
                    <td className="table-dark text-center">{moment(contract.data_inicio).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">{moment(contract.data_termino).format('DD/MM/YYYY')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="table-dark text-center">Não possui Versão</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
          totalRow > 6 &&
          <div className='d-flex justify-content-center mt-2 mb-3'>
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(totalRow / 6)}
              page={page}
              onChange={handleChangePageContractHistoryVersion}
              variant="outlined"
              size="large"
              sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
            />
          </div>
        }
      </div>
      <ToastContainer />
    </>
  );
}
