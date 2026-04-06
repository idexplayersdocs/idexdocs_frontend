import React, { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPenSquare, faX } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { createContractVersion, editContractVersion, getContractVersion } from '@/lib/http-service/contract';

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

export default function ContractHistoryVersion({ contractId }: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true);
  const [contractHistoryVersion, setContractHistoryVersion] = useState<any[]>([]);

  const [openRegisterVersion, setOpenRegisterVersion] = useState(false);
  const [openEditVersion, setOpenEditVersion] = useState(false);

  const [formVersion, setFormVersion] = useState<Record<string, any>>({
    contrato_id: contractId,
    data_inicio: '',
    data_termino: '',
    observacao: '',
    arquivo: null,
    versao_id: '',
    arquivo_url: '',
  });

  const fetchVersions = async (targetPage: number) => {
    setLoading(true);
    try {
      const result = await getContractVersion(contractId, targetPage);
      setContractHistoryVersion(result?.data ?? []);
      setTotalRow(result?.total ?? 0);
    } catch (error: any) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      fetchVersions(page);
    }
  }, [contractId, page]);

  const resetForm = () => {
    setFormVersion({
      contrato_id: contractId,
      data_inicio: '',
      data_termino: '',
      observacao: '',
      arquivo: null,
      versao_id: '',
      arquivo_url: '',
    });
  };

  const handleOpenRegisterVersion = () => setOpenRegisterVersion(true);
  const handleCloseRegisterVersion = () => {
    setOpenRegisterVersion(false);
    resetForm();
  };

  const handleOpenEditVersion = (version: Record<string, any>) => {
    setFormVersion({
      contrato_id: contractId,
      data_inicio: version.data_inicio,
      data_termino: version.data_termino,
      observacao: version.observacao ?? '',
      arquivo: null,
      versao_id: version.versao_id ?? version.id,
      arquivo_url: version.arquivo_url ?? '',
    });
    setOpenEditVersion(true);
  };
  const handleCloseEditVersion = () => {
    setOpenEditVersion(false);
    resetForm();
  };

  const handleInputChangeVersion = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormVersion((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChangeVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. O tamanho máximo permitido é 10MB.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: 'dark',
        transition: Bounce,
      });
      event.target.value = '';
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. São permitidos apenas PDF, JPG, JPEG e PNG.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: 'dark',
        transition: Bounce,
      });
      event.target.value = '';
      return;
    }

    setFormVersion((prev) => ({ ...prev, arquivo: file }));
  };

  const handleSaveRegisterVersion = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('contrato_id', String(formVersion.contrato_id));
      formData.append('data_inicio', formVersion.data_inicio);
      formData.append('data_termino', formVersion.data_termino);
      if (formVersion.observacao) formData.append('observacao', formVersion.observacao);
      if (formVersion.arquivo) formData.append('arquivo', formVersion.arquivo);

      const response = await createContractVersion(formData);
      if (response) {
        handleCloseRegisterVersion();
        setPage(1);
        await fetchVersions(1);
      }
    } catch (error: any) {
      toast.error('Erro ao registrar versão', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditVersion = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('versao_id', String(formVersion.versao_id));
      formData.append('data_inicio', formVersion.data_inicio);
      formData.append('data_termino', formVersion.data_termino);
      if (formVersion.observacao) formData.append('observacao', formVersion.observacao);
      if (formVersion.arquivo) formData.append('arquivo', formVersion.arquivo);

      await editContractVersion(formData);
      handleCloseEditVersion();
      setPage(1);
      await fetchVersions(1);
    } catch (error: any) {
      toast.error('Erro ao editar versão', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVersionFile = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleChangePageContractHistoryVersion = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    fetchVersions(newPage);
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
      <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterVersion}>
        <AddButton />
      </div>
      <div className="" style={{ overflow: 'auto' }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Versão</th>
              <th className="table-dark text-center" scope="col">Observação</th>
              <th className="table-dark text-center" scope="col">Data Início</th>
              <th className="table-dark text-center" scope="col">Data Término</th>
              <th className="table-dark text-center" scope="col">Arquivo</th>
              <th className="table-dark text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {contractHistoryVersion.length > 0 ? (
              Array.isArray(contractHistoryVersion) &&
              contractHistoryVersion.map((version, index: number) => (
                <tr key={index}>
                  <td className="table-dark text-center">{version.versao}</td>
                  <td className="table-dark text-center">{version.observacao}</td>
                  <td className="table-dark text-center">{moment(version.data_inicio).format('DD/MM/YYYY')}</td>
                  <td className="table-dark text-center">{moment(version.data_termino).format('DD/MM/YYYY')}</td>
                  <td className="table-dark text-center">
                    {version.arquivo_url && (
                      <div style={{ display: 'inline-block' }} onClick={() => handleDownloadVersionFile(version.arquivo_url)}>
                        <FontAwesomeIcon
                          className="ms-2 me-2"
                          icon={faDownload}
                          style={{ color: 'white', cursor: 'pointer' }}
                          size="xl"
                        />
                      </div>
                    )}
                  </td>
                  <td className="table-dark text-end" style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-block' }} onClick={() => handleOpenEditVersion(version)}>
                      <FontAwesomeIcon
                        className="ms-2 me-2"
                        icon={faPenSquare}
                        style={{ color: 'white', cursor: 'pointer' }}
                        size="xl"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="table-dark text-center">Não possui Versão</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalRow > 6 && (
          <div className='d-flex justify-content-center mt-2 mb-3'>
            <Pagination
              className="pagination-bar"
              count={Math.ceil(totalRow / 6)}
              page={page}
              onChange={handleChangePageContractHistoryVersion}
              variant="outlined"
              size="large"
              sx={{
                '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' },
                '& .MuiPaginationItem-page': { color: 'white' },
                '& .MuiPaginationItem-icon': { color: 'white' },
              }}
            />
          </div>
        )}
      </div>

      {/* Modal: Registrar Versão */}
      <Modal
        open={openRegisterVersion}
        onClose={handleCloseRegisterVersion}
        aria-labelledby="modal-register-version-title"
        aria-describedby="modal-register-version-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Versão" />
            <FontAwesomeIcon icon={faX} style={{ color: '#ffffff', cursor: 'pointer' }} size="xl" onClick={handleCloseRegisterVersion} />
          </div>
          <hr />
          <div className="row" style={{ height: 'auto' }}>
            <div className="col-md">
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data Início</label>
                <input
                  type="date"
                  className="form-control input-create input-date bg-dark-custom"
                  name="data_inicio"
                  style={{ height: '45px' }}
                  value={formVersion.data_inicio}
                  onChange={handleInputChangeVersion}
                />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data Término</label>
                <input
                  type="date"
                  className="form-control input-create input-date bg-dark-custom"
                  name="data_termino"
                  style={{ height: '45px' }}
                  value={formVersion.data_termino}
                  onChange={handleInputChangeVersion}
                />
              </div>
            </div>
            <div className="d-flex flex-column w-100 mt-3">
              <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Observação</label>
              <input
                type="text"
                className="form-control input-create input-date bg-dark-custom"
                placeholder="Digite..."
                name="observacao"
                style={{ height: '45px' }}
                value={formVersion.observacao}
                onChange={handleInputChangeVersion}
              />
            </div>
            <div className="d-flex flex-column w-100 mt-3">
              <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Arquivo (PDF, JPG, JPEG, PNG — máx. 10MB)</label>
              <input
                type="file"
                className="form-control input-create bg-dark-custom"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ height: '45px' }}
                onChange={handleFileChangeVersion}
              />
            </div>
            <div className="ms-3 d-flex flex-column mt-3" style={{ width: '98%' }}>
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: 'auto' }}
                onClick={handleSaveRegisterVersion}>
                Salvar
              </button>
            </div>
          </div>
          <ToastContainer />
        </Box>
      </Modal>

      {/* Modal: Editar Versão */}
      <Modal
        open={openEditVersion}
        onClose={handleCloseEditVersion}
        aria-labelledby="modal-edit-version-title"
        aria-describedby="modal-edit-version-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Versão" />
            <FontAwesomeIcon icon={faX} style={{ color: '#ffffff', cursor: 'pointer' }} size="xl" onClick={handleCloseEditVersion} />
          </div>
          <hr />
          <div className="row" style={{ height: 'auto' }}>
            <div className="col-md">
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data Início</label>
                <input
                  type="date"
                  className="form-control input-create input-date bg-dark-custom"
                  name="data_inicio"
                  style={{ height: '45px' }}
                  value={formVersion.data_inicio}
                  onChange={handleInputChangeVersion}
                />
              </div>
              <div className="d-flex flex-column w-100 mt-3">
                <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Data Término</label>
                <input
                  type="date"
                  className="form-control input-create input-date bg-dark-custom"
                  name="data_termino"
                  style={{ height: '45px' }}
                  value={formVersion.data_termino}
                  onChange={handleInputChangeVersion}
                />
              </div>
            </div>
            <div className="d-flex flex-column w-100 mt-3">
              <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Observação</label>
              <input
                type="text"
                className="form-control input-create input-date bg-dark-custom"
                placeholder="Digite..."
                name="observacao"
                style={{ height: '45px' }}
                value={formVersion.observacao}
                onChange={handleInputChangeVersion}
              />
            </div>
            <div className="d-flex flex-column w-100 mt-3">
              <label className="ms-3" style={{ color: 'white', fontSize: '20px' }}>Arquivo (PDF, JPG, JPEG, PNG — máx. 10MB)</label>
              {formVersion.arquivo_url && (
                <p className="ms-3 mt-1" style={{ color: '#aaa', fontSize: '14px' }}>
                  Arquivo atual disponível.{' '}
                  <span
                    style={{ color: 'var(--bg-ternary-color)', cursor: 'pointer' }}
                    onClick={() => handleDownloadVersionFile(formVersion.arquivo_url)}>
                    Baixar
                  </span>
                </p>
              )}
              <input
                type="file"
                className="form-control input-create bg-dark-custom"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ height: '45px' }}
                onChange={handleFileChangeVersion}
              />
            </div>
            <div className="ms-3 d-flex flex-column mt-3" style={{ width: '98%' }}>
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: 'auto' }}
                onClick={handleSaveEditVersion}>
                Salvar
              </button>
            </div>
          </div>
          <ToastContainer />
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
}
