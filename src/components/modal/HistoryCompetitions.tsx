import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-history-competitions.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createCompetitions, getCompetitions } from '@/pages/api/http-service/competitions';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Loading from 'react-loading';
import moment from 'moment';

const style = {

};

export default function HistoryCompetitions({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1)
  const [openRegisterCompetitions, setOpenRegisterCompetitions] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [competitions, setCompetitions] = useState<any>({
    nome: '',
    data_competicao: '',
    jogos_completos: '',
    jogos_parciais: '',
    minutagem: '',
    gols: '',
    assistencias: ''
  });

  const [formRegisterCompetitions, setFormRegisterCompetitions] = useState<any>({
    atleta_id: athleteId,
    nome: '',
    data_competicao: '',
    jogos_completos: '',
    jogos_parciais: '',
    minutagem: '',
    gols: '',
    assistencias: ''
  });


  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true);
        try {
          const competitionList = await getCompetitions(athleteId, page);
          setCompetitions(competitionList?.data);
          setTotalRow(competitionList?.total);
        } catch (error:any) {
          console.error('Error:', error);
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

      fetchAthletesData();
    }
  }, [athleteId, page]);

  const handleOpenRegisterCompetitions = () => setOpenRegisterCompetitions(true);
  const handleCloseRegisterCompetitions = () => {
    setOpenRegisterCompetitions(false)
    setFormRegisterCompetitions({
      atleta_id: athleteId,
      nome: '',
      data_competicao: '',
      jogos_completos: '',
      jogos_parciais: '',
      minutagem: '',
      gols: '',
      assistencias: ''
    });
  }

  const handleInputChangeRegisterCompetitions = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterCompetitions((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterCompetitions = async () => {
    setLoading(true);
    try {
      const response = await createCompetitions(formRegisterCompetitions);

      handleCloseRegisterCompetitions();

      setPage(1)
      const clubCompetitions = await getCompetitions(athleteId, page);
      setCompetitions(clubCompetitions?.data);
      setTotalRow(clubCompetitions?.total);
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

  const handleChangePageCompetitions = (event: any, newPage:number) => {
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
    <div className='d-flex justify-content-between'>
      <Subtitle subtitle='Competições'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterCompetitions}>
      <AddButton />
    </div>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Data</th>
              <th className="table-dark text-center" scope="col">Competição</th>
              <th className="table-dark text-center" scope="col">Jogos Completos</th>
              <th className="table-dark text-center" scope="col">Jogos Parciais</th>
              <th className="table-dark text-center" scope="col">Minutagem</th>
              <th className="table-dark text-center" scope="col">Gols</th>
              <th className="table-dark text-center" scope="col">Assistências</th>
            </tr>
          </thead>
          <tbody>
            {
              competitions.length > 0 ? (
                Array.isArray(competitions) && competitions.map((competicao, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{moment(competicao.data_competicao).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">{competicao.nome}</td>
                    <td className="table-dark text-center">{competicao.jogos_completos}</td>
                    <td className="table-dark text-center">{competicao.jogos_parciais}</td>
                    <td className="table-dark text-center">{competicao.minutagem}</td>
                    <td className="table-dark text-center">{competicao.gols}</td>
                    <td className="table-dark text-center">{competicao.assistencias}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-dark text-center">Não possui histórico</td>
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
                  onChange={handleChangePageCompetitions}
                  variant="outlined"
                  size="large"
                  sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
                />
        }
      </div>

      <Modal
        open={openRegisterCompetitions}
        onClose={handleCloseRegisterCompetitions}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Competição"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterCompetitions} />
          </div>
          <hr />
          <div className="row" style={{height:'300px'}}>
              <div className='col'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="nome" style={{height:'45px'}} value={formRegisterCompetitions.nome} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data da Competição</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_competicao" style={{height:'45px'}} value={formRegisterCompetitions.data_competicao} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Completos</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="jogos_completos" style={{height:'45px'}} value={formRegisterCompetitions.jogos_completos} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Parciais</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="jogos_parciais" style={{height:'45px'}} value={formRegisterCompetitions.jogos_parciais} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
              </div>
              <div className='col'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Minutagem</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="minutagem" style={{height:'45px'}} value={formRegisterCompetitions.minutagem} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Gols</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="gols" style={{height:'45px'}} value={formRegisterCompetitions.gols} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Parciais</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="assistencias" style={{height:'45px'}} value={formRegisterCompetitions.assistencias} onChange={handleInputChangeRegisterCompetitions}/>
                </div>
              </div>
            </div>
          <div className='ms-3 d-flex flex-column mt-5' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveRegisterCompetitions}>Salvar</button>
          </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
