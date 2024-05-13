import React, { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-clubs.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import Loading from 'react-loading';
import { createClub, getClub } from '@/pages/api/http-service/club';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
};

export default function ClubHistory({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [openRegisterClub, setOpenRegisterClub] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [club, setClub] = useState<any>({
    nome: '',
    data_inicio: '',
    data_fim: '',
  });

  const [formRegisterClub, setFormRegisterClub] = useState<any>({
    atleta_id: athleteId,
    nome: '',
    data_inicio: '',
    data_fim: '',
    clube_atual: false
  });

  const handleCloseModal = () => {
    closeModal();
  };
  
  const handleChangePage = (event: any, newPage:number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true);
        try {
          const clubList = await getClub(athleteId, page);
          setClub(clubList?.data);
          setTotalRow(clubList?.total);

        } catch (error: any) {
          toast.error(error.response.data.errors[0].message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAthletesData();
    }
  }, [athleteId, page]);

  const handleOpenRegisterClub = () => setOpenRegisterClub(true);
  const handleCloseRegisterClub = () => {
    setOpenRegisterClub(false)
    setFormRegisterClub({
      atleta_id: athleteId,
      nome: '',
      data_inicio: '',
      data_fim: '',
      clube_atual: false
    });
  }

  const handleInputChangeRegisterClub = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterClub((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterClub = async () => {
    setLoading(true);
    try {
      const response = await createClub(formRegisterClub);

      handleCloseRegisterClub()

      setPage(1)
      const clubList = await getClub(athleteId, page);
      setClub(clubList?.data);
      setTotalRow(clubList?.total);
    } catch (error:any) {
      toast.error(error.response.data.errors[0].message, {
        position: "bottom-center",
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
      <Subtitle subtitle='Clubes'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterClub}>
      <AddButton />
    </div>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Clube</th>
              <th className="table-dark text-center" scope="col">Data de Início</th>
              <th className="table-dark text-center" scope="col">Data de Término</th>
            </tr>
          </thead>
          <tbody>
            {
              club.length > 0 ? (
                Array.isArray(club) && club.map((clube, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{clube.nome}</td>
                    <td className="table-dark text-center">{moment(clube.data_inicio).format('DD/MM/YYY')}</td>
                    <td className="table-dark text-center">{clube.data_fim ? clube.data_fim : 'Atual'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Não possui Clube</td>
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
              onChange={handleChangePage}
              variant="outlined"
              size="large"
              sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
            />
        }
      </div>

      <Modal
        open={openRegisterClub}
        onClose={handleCloseRegisterClub}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Clube"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterClub} />
          </div>
          <hr />
          <div className="row" style={{height:'400px'}}>
              <div className=''>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome do Clube</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="nome" style={{height:'45px'}} value={formRegisterClub.nome} onChange={handleInputChangeRegisterClub}/>
                </div>
                <div className="mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Clube Atual</label>
                  <Checkbox 
                    color="success" 
                    name="clube_atual" 
                    onChange={(event) => setFormRegisterClub((prevState: any) => ({
                      ...prevState,
                      clube_atual: event.target.checked,
                    }))} 
                    checked={formRegisterClub.clube_atual} 
                    sx={{
                      color: "var(--bg-ternary-color)",
                      '&.Mui-checked': {
                        color: "var(--bg-ternary-color)",
                      },
                    }}
                  />
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data de Início</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_inicio" style={{height:'45px'}} value={formRegisterClub.data_inicio} onChange={handleInputChangeRegisterClub} />
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>{formRegisterClub.clube_atual ? 'Data de Término do Clube Anterior': 'Data de Término'}</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_fim" style={{height:'45px'}} value={formRegisterClub.data_fim} onChange={handleInputChangeRegisterClub}/>
                </div>
              </div>
            </div>
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveRegisterClub}>Salvar</button>
          </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
