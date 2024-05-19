import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenSquare, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createInjuries, getInjuries } from '@/pages/api/http-service/injuries';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { getContract } from '@/pages/api/http-service/contract';

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

export default function ContractHistory({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [openRegisterContractHistory, setOpenRegisterContractHistory] = useState(false);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [contractHistory, setContractHistory] = useState<any>({
    contrato_tipo: '',
    contrato_nome: '',
    data_inicio: '',
    data_termino: '',
    observacao: '',
    ativo: false
  });
  const [formRegisterContractHistory, setFormRegisterContractHistory] = useState<any>({
    atleta_id: athleteId,
    descricao: '',
    data_lesao: ''
  });


  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true)
        try {
          const contractHistoryList = await getContract(athleteId, page);
          setContractHistory(contractHistoryList?.data);
          setTotalRow(contractHistoryList?.total);
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
  }, [athleteId, page]);

  const handleOpenRegisterContractHistory = () => setOpenRegisterContractHistory(true);
  const handleCloseRegisterContractHistory = () => {
    setOpenRegisterContractHistory(false)
    setFormRegisterContractHistory({
      atleta_id: athleteId,
      descricao: '',
      data_lesao: ''
    });
  }
  const handleInputChangeRegisterContractHistory = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterContractHistory((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterContractHistory = async () => {
    setLoading(true);
    try {
      const response = await createInjuries(formRegisterContractHistory);

      handleCloseRegisterContractHistory()

      setPage(1)
      const contractHistoryList = await getInjuries(athleteId, page);
      setContractHistory(contractHistoryList?.data);
      setTotalRow(contractHistoryList?.total);
    } catch (error:any) {
      toast.error(error.response.data.errors[0].message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePageContractHistory = (event: any, newPage:number) => {
    setPage(newPage);
  };

  const handleCloseModal = () => {
    closeModal();
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
    <div className='d-flex justify-content-between'>
      <Subtitle subtitle='Contratos'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterContractHistory}>
      <AddButton />
    </div>
      <div className="" style={{overflow: 'auto'}}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Tipo</th>
              <th className="table-dark text-center" scope="col">Nome</th>
              <th className="table-dark text-center" scope="col">Versão</th>
              <th className="table-dark text-center" scope="col">Observação</th>
              <th className="table-dark text-center" scope="col">Data Início</th>
              <th className="table-dark text-center" scope="col">Data Término</th>
              <th className="table-dark text-center" scope="col">Ativo</th>
              <th className="table-dark text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {
              contractHistory.length > 0 ? (
                Array.isArray(contractHistory) && contractHistory.map((contract, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{contract.contrato_tipo}</td>
                    <td className="table-dark text-center">{contract.contrato_nome}</td>
                    <td className="table-dark text-center">{contract.versao}</td>
                    <td className="table-dark text-center">{contract.observacao}</td>
                    <td className="table-dark text-center">{moment(contract.data_inicio).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">{moment(contract.data_termino).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">
                      <FontAwesomeIcon icon={contract.ativo ? faCheck : faXmark} size='xl' style={contract.ativo? { color: "#15ff00" } : { color: "#ff0000" }} />
                    </td>
                    <td className="table-dark text-center">
                    <FontAwesomeIcon icon={faPenSquare} style={{ color: "white", cursor: "pointer" }} size="xl" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-dark text-center">Não possui Contratos</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
          totalRow > 6 &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(totalRow / 6)}
              page={page}
              onChange={handleChangePageContractHistory}
              variant="outlined"
              size="large"
              sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
            />
        }
      </div>
      <Modal
        open={openRegisterContractHistory}
        onClose={handleCloseRegisterContractHistory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Clube"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterContractHistory} />
          </div>
          <hr />
          <div className="row" style={{height:'250px'}}>
              <div className='col-md'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data da Lesão</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_lesao" style={{height:'45px'}} value={formRegisterContractHistory.data_lesao} onChange={handleInputChangeRegisterContractHistory}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Descrição da Lesão</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="descricao" style={{height:'45px'}} value={formRegisterContractHistory.descricao} onChange={handleInputChangeRegisterContractHistory} />
                </div>
              </div>
            </div>
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveRegisterContractHistory}>Salvar</button>
          </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
