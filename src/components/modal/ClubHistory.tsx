import React, { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenSquare, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import Loading from 'react-loading';
import { createClub, getClub, updateClub } from '@/lib/http-service/club';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from '@/lib/toast-error';
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

export default function ClubHistory({ closeModal, athleteId }: any) {
  const effectRan = useRef(false);
  const [openRegisterClub, setOpenRegisterClub] = useState(false);
  const [openEditClub, setOpenEditClub] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [club, setClub] = useState<any[]>([]);

  const emptyForm = {
    atleta_id: athleteId,
    nome: '',
    data_inicio: '',
    data_fim: '',
    clube_atual: false
  };

  const [formRegisterClub, setFormRegisterClub] = useState<Record<string, any>>(emptyForm);

  const isFormValid = () =>
    formRegisterClub.nome.trim() !== '' &&
    formRegisterClub.data_inicio.trim() !== '';

  const fetchClubs = async (targetPage: number, silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const clubList = await getClub(athleteId, targetPage);
      setClub(clubList?.data ?? []);
      setTotalRow(clubList?.total ?? 0);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao carregar clubes.');
      console.error('Error:', error);
    } finally {
      if (!silent) setLoading(false);
      else setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      fetchClubs(page);
      effectRan.current = true;
    }
  }, [athleteId, page]);

  const handleOpenRegisterClub = () => setOpenRegisterClub(true);
  const handleCloseRegisterClub = () => {
    setOpenRegisterClub(false);
    setFormRegisterClub(emptyForm);
  };

  const handleOpenEditClub = (clube: Record<string, unknown>) => {
    setFormRegisterClub({
      atleta_id: athleteId,
      clube_id: clube.clube_id,
      nome: clube.nome,
      data_inicio: clube.data_inicio,
      data_fim: clube.data_fim,
      clube_atual: clube.clube_atual
    });
    setOpenEditClub(true);
  };

  const handleCloseEditClub = () => {
    setOpenEditClub(false);
    setFormRegisterClub(emptyForm);
  };

  const handleInputChangeRegisterClub = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterClub((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveRegisterClub = async () => {
    setIsSaving(true);
    try {
      await createClub(formRegisterClub);
      handleCloseRegisterClub();
      showSuccessToast('Clube registrado com sucesso!');
      setPage(1);
      await fetchClubs(1, true);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao registrar clube. Tente novamente.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditClub = async () => {
    setIsSaving(true);
    try {
      await updateClub(formRegisterClub);
      handleCloseEditClub();
      showSuccessToast('Clube atualizado com sucesso!');
      setPage(1);
      await fetchClubs(1, true);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao atualizar clube. Tente novamente.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    fetchClubs(newPage, true);
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
        <Subtitle subtitle='Clubes' />
        <FontAwesomeIcon icon={faX} color='white' size='xl' style={{ cursor: 'pointer' }} onClick={closeModal} />
      </div>
      <hr />
      <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterClub}>
        <AddButton />
      </div>
      <div style={{ overflow: 'auto' }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Clube</th>
              <th className="table-dark text-center" scope="col">Data de Início</th>
              <th className="table-dark text-center" scope="col">Data de Término</th>
              <th className="table-dark text-center" scope="col">Clube Atual</th>
              <th className="table-dark text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {club.length > 0 ? (
              club.map((clube, index: number) => (
                <tr key={index}>
                  <td className="table-dark text-center">{clube.nome}</td>
                  <td className="table-dark text-center">{moment(clube.data_inicio).format('DD/MM/YYYY')}</td>
                  <td className="table-dark text-center">{clube.data_fim ? moment(clube.data_fim).format('DD/MM/YYYY') : 'Atual'}</td>
                  <td className="table-dark text-center">
                    {clube.clube_atual ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
                  </td>
                  <td className="table-dark text-center">
                    <FontAwesomeIcon icon={faPenSquare} size='xl' style={{ cursor: 'pointer' }} onClick={() => handleOpenEditClub(clube)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="table-dark text-center">Não possui Clube</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalRow > 6 &&
          <Pagination
            className="pagination-bar"
            count={Math.ceil(totalRow / 6)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            size="large"
            sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': { color: 'white' }, '& .MuiPaginationItem-icon': { color: 'white' } }}
          />
        }
      </div>

      {/* Registrar Clube */}
      <Modal
        open={openRegisterClub}
        onClose={handleCloseRegisterClub}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Clube" />
            <FontAwesomeIcon icon={faX} style={{ color: "#ffffff", cursor: 'pointer' }} size="xl" onClick={handleCloseRegisterClub} />
          </div>
          <hr />
          <div className="row" style={{ height: 'auto' }}>
            <div className='col-md'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Nome do Clube *</label>
                <input type="text" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="nome" style={{ height: '45px' }} value={formRegisterClub.nome} onChange={handleInputChangeRegisterClub} />
              </div>
              <div className="mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Clube Atual</label>
                <Checkbox
                  color="success"
                  name="clube_atual"
                  onChange={(event) => setFormRegisterClub((prevState) => ({
                    ...prevState,
                    clube_atual: event.target.checked,
                  }))}
                  checked={formRegisterClub.clube_atual as boolean}
                  sx={{ color: "var(--bg-ternary-color)", '&.Mui-checked': { color: "var(--bg-ternary-color)" } }}
                />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data de Início *</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_inicio" style={{ height: '45px' }} value={formRegisterClub.data_inicio as string} onChange={handleInputChangeRegisterClub} />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data de Término</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_fim" style={{ height: '45px' }} value={formRegisterClub.data_fim as string} onChange={handleInputChangeRegisterClub} />
              </div>
            </div>
          </div>
          <div className='ms-3 d-flex flex-column mt-3' style={{ width: '98%' }}>
            <button type="button" className="btn btn-success align-self-end" style={{ width: 'auto' }} onClick={handleSaveRegisterClub} disabled={!isFormValid() || isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Box>
      </Modal>

      {/* Editar Clube */}
      <Modal
        open={openEditClub}
        onClose={handleCloseEditClub}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Clube" />
            <FontAwesomeIcon icon={faX} style={{ color: "#ffffff", cursor: 'pointer' }} size="xl" onClick={handleCloseEditClub} />
          </div>
          <hr />
          <div className="row" style={{ height: 'auto' }}>
            <div className='col-md'>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Nome do Clube *</label>
                <input type="text" className="form-control input-create input-date bg-dark-custom" placeholder="Digite..." name="nome" style={{ height: '45px' }} value={formRegisterClub.nome as string} onChange={handleInputChangeRegisterClub} />
              </div>
              <div className="mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Clube Atual</label>
                <Checkbox
                  color="success"
                  name="clube_atual"
                  onChange={(event) => setFormRegisterClub((prevState) => ({
                    ...prevState,
                    clube_atual: event.target.checked,
                  }))}
                  checked={formRegisterClub.clube_atual}
                  sx={{ color: "var(--bg-ternary-color)", '&.Mui-checked': { color: "var(--bg-ternary-color)" } }}
                />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data de Início *</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_inicio" style={{ height: '45px' }} value={formRegisterClub.data_inicio} onChange={handleInputChangeRegisterClub} />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data de Término</label>
                <input type="date" className="form-control input-create input-date bg-dark-custom" name="data_fim" style={{ height: '45px' }} value={formRegisterClub.data_fim} onChange={handleInputChangeRegisterClub} />
              </div>
            </div>
          </div>
          <div className='ms-3 d-flex flex-column mt-3' style={{ width: '98%' }}>
            <button type="button" className="btn btn-success align-self-end" style={{ width: 'auto' }} onClick={handleSaveEditClub} disabled={!isFormValid() || isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Box>
      </Modal>

      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick draggable theme="dark" style={{ zIndex: 9999 }} />
    </>
  );
}
