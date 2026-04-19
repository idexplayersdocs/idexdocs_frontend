import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faX } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createCompetitions, getCompetitions, updateCompetitions } from '@/lib/http-service/competitions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from '@/lib/toast-error';
import Loading from 'react-loading';
import moment from 'moment';

const styleForm = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxHeight: '90vh',
  overflow: 'auto'
};

export default function HistoryCompetitions({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1);
  const [openRegisterCompetitions, setOpenRegisterCompetitions] = useState(false);
  const [openEditCompetitions, setOpenEditCompetitions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [competitions, setCompetitions] = useState<any[]>([]);

  const emptyForm = {
    atleta_id: athleteId,
    nome: '',
    data_competicao: '',
    jogos_completos: '',
    jogos_parciais: '',
    minutagem: '',
    gols: '',
    assistencias: ''
  };

  const [formRegisterCompetitions, setFormRegisterCompetitions] = useState<Record<string, any>>(emptyForm);

  const isFormValid = () =>
    formRegisterCompetitions.nome.trim() !== '' &&
    formRegisterCompetitions.data_competicao.trim() !== '';

  const fetchCompetitions = async (targetPage: number, silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const competitionList = await getCompetitions(athleteId, targetPage);
      setCompetitions(competitionList?.data ?? []);
      setTotalRow(competitionList?.total ?? 0);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao carregar competições.');
      console.error('Error:', error);
    } finally {
      if (!silent) setLoading(false);
      else setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      fetchCompetitions(page);
      effectRan.current = true;
    }
  }, [athleteId, page]);

  const handleOpenRegisterCompetitions = () => setOpenRegisterCompetitions(true);
  const handleCloseRegisterCompetitions = () => {
    setOpenRegisterCompetitions(false);
    setFormRegisterCompetitions(emptyForm);
  };

  const handleOpenEditCompetitions = (competition: Record<string, unknown>) => {
    setFormRegisterCompetitions({
      atleta_id: athleteId,
      competicao_id: competition.competicao_id,
      nome: competition.nome,
      data_competicao: competition.data_competicao,
      jogos_completos: competition.jogos_completos,
      jogos_parciais: competition.jogos_parciais,
      minutagem: competition.minutagem,
      gols: competition.gols,
      assistencias: competition.assistencias
    });
    setOpenEditCompetitions(true);
  };

  const handleCloseEditCompetitions = () => {
    setOpenEditCompetitions(false);
    setFormRegisterCompetitions(emptyForm);
  };

  const handleInputChangeRegisterCompetitions = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterCompetitions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterCompetitions = async () => {
    setIsSaving(true);
    try {
      await createCompetitions(formRegisterCompetitions);
      handleCloseRegisterCompetitions();
      showSuccessToast('Competição registrada com sucesso!');
      setPage(1);
      await fetchCompetitions(1, true);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao registrar competição. Tente novamente.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditCompetitions = async () => {
    setIsSaving(true);
    try {
      await updateCompetitions(formRegisterCompetitions);
      handleCloseEditCompetitions();
      showSuccessToast('Competição atualizada com sucesso!');
      setPage(1);
      await fetchCompetitions(1, true);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao atualizar competição. Tente novamente.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePageCompetitions = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    fetchCompetitions(newPage, true);
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
        <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={closeModal}/>
      </div>
      <hr />
      <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterCompetitions}>
        <AddButton />
      </div>
      <div style={{overflow: 'auto'}}>
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
              <th className="table-dark text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {competitions.length > 0 ? (
              competitions.map((competicao, index: number) => (
                <tr key={index}>
                  <td className="table-dark text-center">{moment(competicao.data_competicao).format('DD/MM/YYYY')}</td>
                  <td className="table-dark text-center">{competicao.nome}</td>
                  <td className="table-dark text-center">{competicao.jogos_completos}</td>
                  <td className="table-dark text-center">{competicao.jogos_parciais}</td>
                  <td className="table-dark text-center">{competicao.minutagem}</td>
                  <td className="table-dark text-center">{competicao.gols}</td>
                  <td className="table-dark text-center">{competicao.assistencias}</td>
                  <td className="table-dark text-center">
                    <FontAwesomeIcon icon={faPenSquare} size='xl' style={{cursor: 'pointer'}} onClick={() => handleOpenEditCompetitions(competicao)}/>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="table-dark text-center">Não possui histórico</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalRow > 6 &&
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

      {/* Registrar Competição */}
      <Modal
        open={openRegisterCompetitions}
        onClose={handleCloseRegisterCompetitions}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Competição"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterCompetitions} />
          </div>
          <hr />
          <div className="row" style={{height:'auto'}}>
            <div className='col-md-6'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome *</label>
                <input type="text" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="nome" style={{height:'45px'}} value={formRegisterCompetitions.nome} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data da Competição *</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_competicao" style={{height:'45px'}} value={formRegisterCompetitions.data_competicao} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Completos</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="jogos_completos" style={{height:'45px'}} value={formRegisterCompetitions.jogos_completos} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Parciais</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="jogos_parciais" style={{height:'45px'}} value={formRegisterCompetitions.jogos_parciais} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Minutagem</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="minutagem" style={{height:'45px'}} value={formRegisterCompetitions.minutagem} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Gols</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="gols" style={{height:'45px'}} value={formRegisterCompetitions.gols} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Assistências</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="assistencias" style={{height:'45px'}} value={formRegisterCompetitions.assistencias} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
            </div>
            <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
              <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveRegisterCompetitions} disabled={!isFormValid() || isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Editar Competição */}
      <Modal
        open={openEditCompetitions}
        onClose={handleCloseEditCompetitions}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Competição"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseEditCompetitions} />
          </div>
          <hr />
          <div className="row" style={{height:'auto'}}>
            <div className='col-md-6'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome *</label>
                <input type="text" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="nome" style={{height:'45px'}} value={formRegisterCompetitions.nome} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data da Competição *</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_competicao" style={{height:'45px'}} value={formRegisterCompetitions.data_competicao} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Completos</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="jogos_completos" style={{height:'45px'}} value={formRegisterCompetitions.jogos_completos} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Jogos Parciais</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="jogos_parciais" style={{height:'45px'}} value={formRegisterCompetitions.jogos_parciais} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Minutagem</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="minutagem" style={{height:'45px'}} value={formRegisterCompetitions.minutagem} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Gols</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="gols" style={{height:'45px'}} value={formRegisterCompetitions.gols} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Assistências</label>
                <input type="number" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="assistencias" style={{height:'45px'}} value={formRegisterCompetitions.assistencias} onChange={handleInputChangeRegisterCompetitions}/>
              </div>
            </div>
            <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
              <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveEditCompetitions} disabled={!isFormValid() || isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick draggable theme="dark" style={{ zIndex: 9999 }} />
    </>
  );
}
