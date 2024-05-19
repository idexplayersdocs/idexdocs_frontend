import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-lesoes.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createInjuries, getInjuries } from '@/pages/api/http-service/injuries';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';

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

export default function Injuries({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [openRegisterInjuries, setOpenRegisterInjuries] = useState(false);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [injuries, setInjuries] = useState<any>({
    nome: '',
    data_inicio: '',
    data_fim: '',
  });
  const [formRegisterInjuries, setFormRegisterInjuries] = useState<any>({
    atleta_id: athleteId,
    descricao: '',
    data_lesao: ''
  });


  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true)
        try {
          const injuriesList = await getInjuries(athleteId, page);
          setInjuries(injuriesList?.data);
          setTotalRow(injuriesList?.total);
        } catch (error:any) {
          console.error('Error:', error);
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
          setLoading(false)

        }
      };
      fetchAthletesData();
    }
  }, [athleteId, page]);

  const handleOpenRegisterInjuries = () => setOpenRegisterInjuries(true);
  const handleCloseRegisterInjuries = () => {
    setOpenRegisterInjuries(false)
    setFormRegisterInjuries({
      atleta_id: athleteId,
      descricao: '',
      data_lesao: ''
    });
  }
  const handleInputChangeRegisterInjuries = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterInjuries((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterInjuries = async () => {
    setLoading(true);
    try {
      const response = await createInjuries(formRegisterInjuries);

      handleCloseRegisterInjuries()

      setPage(1)
      const InjuriesList = await getInjuries(athleteId, page);
      setInjuries(InjuriesList?.data);
      setTotalRow(InjuriesList?.total);
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

  const handleChangePageInjuries = (event: any, newPage:number) => {
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
      <Subtitle subtitle='Lesões'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterInjuries}>
      <AddButton />
    </div>
      <div className="" style={{overflow: 'auto'}}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Data</th>
              {/* <th className="table-dark text-center" scope="col">Lesão</th> */}
              <th className="table-dark text-center" scope="col">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {
              injuries.length > 0 ? (
                Array.isArray(injuries) && injuries.map((competicao, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{moment(competicao.data_lesao).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">{competicao.descricao}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Não possui Lesões</td>
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
              onChange={handleChangePageInjuries}
              variant="outlined"
              size="large"
              sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
            />
        }
      </div>
      <Modal
        open={openRegisterInjuries}
        onClose={handleCloseRegisterInjuries}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Clube"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterInjuries} />
          </div>
          <hr />
          <div className="row" style={{height:'250px'}}>
              <div className='col-md'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data da Lesão</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_lesao" style={{height:'45px'}} value={formRegisterInjuries.data_lesao} onChange={handleInputChangeRegisterInjuries}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Descrição da Lesão</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="descricao" style={{height:'45px'}} value={formRegisterInjuries.descricao} onChange={handleInputChangeRegisterInjuries} />
                </div>
              </div>
            </div>
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveRegisterInjuries}>Salvar</button>
          </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
