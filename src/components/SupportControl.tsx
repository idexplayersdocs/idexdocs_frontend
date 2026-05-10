import React, { useEffect, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faTrashCan, faDownload } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { getSupportControl, deleteSupportControl, createSupportControl } from '@/lib/http-service/relationship';
import { showSuccessToast, showErrorToast } from '@/lib/toast-error';
import Subtitle from '@/components/Subtitle';
import AddButton from '@/components/AddButton';
import type { SupportControl as SupportControlType } from '@/types';

const styleSupportControl = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
  maxWidth: '800px',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxHeight: '90vh',
  overflow: 'auto',
  overflowX: 'hidden',
};

const styleDelete = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
  maxWidth: '800px',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: 'auto',
  overflow: 'auto',
};

interface SupportControlProps {
  athleteId: string;
}

interface SupportControlFormData {
  atleta_id: string;
  nome: string;
  quantidade: string;
  preco: string;
  data_controle: string;
  arquivo: File | null;
}

export default function SupportControl({ athleteId }: SupportControlProps) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SupportControlType[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalValue, setTotalValue] = useState<string>('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SupportControlType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<SupportControlFormData>({
    atleta_id: athleteId,
    nome: '',
    quantidade: '',
    preco: '',
    data_controle: '',
    arquivo: null,
  });

  const fetchSupportControl = async (pageNum: number) => {
    try {
      const supportControl = await getSupportControl(athleteId, pageNum);
      setItems(supportControl?.data.data.controles);
      setTotalRows(supportControl?.data.total);
      setTotalValue(
        supportControl?.data.data.total.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        })
      );
    } catch (error) {
      console.error('Error fetching support control:', error);
    }
  };

  useEffect(() => {
    if (!athleteId) return;
    fetchSupportControl(page);
  }, [athleteId, page]);

  const handleDelete = async () => {
    if (!selectedItem || selectedItem.controle_id === undefined) return;
    try {
      await deleteSupportControl(selectedItem.controle_id);
      await fetchSupportControl(1);
      setPage(1);
      setOpenConfirmDelete(false);
      setSelectedItem(null);
      showSuccessToast(`${selectedItem.nome} foi deletado com sucesso`);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.errors?.[0]?.message ||
          'Erro ao deletar o registro. Tente novamente.'
      );
    }
  };

  // Pagination handler
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  // Currency formatting functions (moved from athleteDetail.tsx)
  const formatCurrency = (value: string) => {
    if (!value) return '';

    // Remove all non-numeric characters except comma
    let cleanValue = value.replace(/[^\d,]/g, '');

    // Handle multiple commas - keep only the last one
    const parts = cleanValue.split(',');
    if (parts.length > 2) {
      cleanValue = parts.slice(0, -1).join('') + ',' + parts[parts.length - 1];
    } else {
      cleanValue = parts.join(',');
    }

    // Limit decimal part to 2 digits
    const finalParts = cleanValue.split(',');
    if (finalParts[1] && finalParts[1].length > 2) {
      finalParts[1] = finalParts[1].substring(0, 2);
      cleanValue = finalParts.join(',');
    }

    return cleanValue;
  };

  const formatCurrencyForDisplay = (value: string) => {
    const formatted = formatCurrency(value);
    if (!formatted) return '';

    // Apply thousands separator for display
    const parts = formatted.split(',');
    let integerPart = parts[0] || '0';
    const decimalPart = parts[1] || '';

    // Add thousands separator
    if (integerPart.length > 3) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    return `R$ ${integerPart}${decimalPart ? ',' + decimalPart : ''}`;
  };

  const parseCurrencyToFloat = (currencyString: string) => {
    if (!currencyString) return 0;
    // Remove currency symbol, spaces, and dots, then handle comma as decimal
    const cleanValue = currencyString.replace(/[R$\s.]/g, '');
    return parseFloat(cleanValue.replace(',', '.')) || 0;
  };

  // Form input handler with special treatment for preco field
  const handleInputChangeSupportControl = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'preco') {
      // Store raw value with basic validation
      const formattedValue = formatCurrency(value);

      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // File input handler with size (10 MB) and type validation
  const handleFileChangeSupportControl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        showErrorToast('Arquivo muito grande. Tamanho máximo: 10MB');
        event.target.value = ''; // Clear the input
        setFormData((prevState) => ({
          ...prevState,
          arquivo: null,
        }));
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showErrorToast('Tipo de arquivo não suportado. Use apenas PDF, JPG, JPEG ou PNG');
        event.target.value = ''; // Clear the input
        setFormData((prevState) => ({
          ...prevState,
          arquivo: null,
        }));
        return;
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      arquivo: file,
    }));
  };

  // Form validation — all required fields including arquivo
  const isFormValidSupportControl = () => {
    const precoValue = parseCurrencyToFloat(formData?.preco || '');

    return (
      (formData?.atleta_id ?? '').toString().trim() !== '' &&
      (formData?.nome ?? '').trim() !== '' &&
      (formData?.quantidade ?? '').toString().trim() !== '' &&
      (formData?.preco ?? '').trim() !== '' && precoValue > 0 &&
      (formData?.data_controle ?? '').trim() !== '' &&
      formData?.arquivo !== null
    );
  };

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setFormData({
      atleta_id: athleteId,
      nome: '',
      quantidade: '',
      preco: '',
      data_controle: '',
      arquivo: null,
    });
  };

  const handleOpenConfirmDelete = (item: SupportControlType) => {
    setSelectedItem(item);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('atleta_id', athleteId?.toString() || '');
      fd.append('nome', formData.nome);
      fd.append('quantidade', formData.quantidade);
      fd.append('preco', parseCurrencyToFloat(formData.preco).toFixed(2));
      fd.append('data_controle', formData.data_controle);
      fd.append('arquivo', formData.arquivo as File);

      await createSupportControl(fd);

      handleCloseCreate();
      await fetchSupportControl(1);
      setPage(1);
      showSuccessToast('Controle de suporte criado com sucesso!');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao criar controle de suporte. Tente novamente.';
      showErrorToast(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadFile = async (supportControl: SupportControlType) => {
    try {
      if ((supportControl as any)?.arquivo_url || (supportControl as any)?.arquivo_path) {
        const downloadUrl = (supportControl as any).arquivo_url || (supportControl as any).arquivo_path;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `comprovante_${supportControl.nome}_${(supportControl as any).id || 'arquivo'}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccessToast('Download iniciado com sucesso!');
      } else {
        showErrorToast('Arquivo não disponível para download.');
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      showErrorToast('Erro ao baixar o arquivo. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <>
      {/* Controle de Suportes section */}
      <div className="col-md d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool">
        <div className='d-flex justify-content-between align-items-center w-100 p-2'>
          <div>
            <Subtitle subtitle='Controle de Suportes' />
          </div>
          <div onClick={handleOpenCreate} className='margin-button-control-support'>
            <AddButton />
          </div>
        </div>
        <div className="mt-3 table-custom-control" style={{ minHeight: '271.5px', maxHeight: '300px', overflow: 'auto', width: '95%' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col" style={{ fontSize: '13px' }}>DATA</th>
                <th className="table-dark text-center" scope="col" style={{ fontSize: '13px' }}>NOME</th>
                <th className="table-dark text-center" scope="col" style={{ fontSize: '13px' }}>QUANTIDADE</th>
                <th className="table-dark text-center" scope="col" style={{ fontSize: '13px' }}>PREÇO</th>
                <th className="table-dark text-center" scope="col" style={{ fontSize: '13px' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                Array.isArray(items) && items.map((supportControl, index) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{moment(supportControl.data_controle).format('DD/MM/YYYY')}</td>
                    <td className="table-dark text-center">{supportControl.nome}</td>
                    <td className="table-dark text-center">{supportControl.quantidade}</td>
                    <td className="table-dark text-center">{supportControl.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="table-dark text-center">
                      <div className="d-flex justify-content-center gap-3">
                        {(supportControl as any).arquivo_url ? (
                          <FontAwesomeIcon
                            icon={faDownload}
                            size="lg"
                            style={{ color: '#28a745', cursor: 'pointer' }}
                            onClick={() => handleDownloadFile(supportControl)}
                            title="Baixar comprovante"
                          />
                        ) : (
                          <span aria-hidden style={{ display: 'inline-block', width: 20, height: 24 }} />
                        )}
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          size="lg"
                          style={{ color: '#ff0000', cursor: 'pointer' }}
                          onClick={() => handleOpenConfirmDelete(supportControl)}
                          title="Excluir registro"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Lista vazia</td>
                </tr>
              )}
            </tbody>
          </table>
          <table>
            <tbody className="table table-striped">
              <tr>
                <th className="table-dark text-center p-2">Total</th>
                <td className="table-dark text-center table-custom p-2">{totalValue}</td>
              </tr>
            </tbody>
          </table>
          <div className='d-flex justify-content-center mt-3'>
            {totalRows > 3 && (
              <Pagination
                className="pagination-bar"
                count={Math.ceil(totalRows / 3)}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                size="large"
                sx={{
                  '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' },
                  '& .MuiPaginationItem-page': { color: 'white' },
                  '& .MuiPaginationItem-icon': { color: 'white' },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={openCreate}
        onClose={handleCloseCreate}
        aria-labelledby="modal-create-support-title"
        aria-describedby="modal-create-support-description"
      >
        <Box sx={styleSupportControl}>
          <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '20px' }}>
            <div>
              <Subtitle subtitle="Criar Controle de Suporte" />
              <small style={{ color: '#adb5bd', marginLeft: '3px' }}>Preencha todos os campos obrigatórios (*)</small>
            </div>
            <FontAwesomeIcon
              icon={faX}
              style={{ color: '#ffffff', cursor: 'pointer', padding: '8px' }}
              size="lg"
              onClick={handleCloseCreate}
            />
          </div>
          <hr style={{ margin: '0 0 25px 0', borderColor: '#495057' }} />
          <div className="row" style={{ minHeight: 'auto', paddingBottom: '20px' }}>
            <div className="col-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Data *</label>
                    <input
                      type="date"
                      className="form-control input-create input-date bg-dark-custom"
                      placeholder="selecione a data"
                      name="data_controle"
                      style={{ height: '45px' }}
                      value={formData.data_controle}
                      onChange={handleInputChangeSupportControl}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Nome *</label>
                    <input
                      type="text"
                      className="form-control input-create input-date bg-dark-custom"
                      placeholder="Digite o nome..."
                      name="nome"
                      style={{ height: '45px' }}
                      value={formData.nome}
                      onChange={handleInputChangeSupportControl}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Quantidade *</label>
                    <input
                      type="number"
                      className="form-control input-create input-date bg-dark-custom"
                      placeholder="Digite a quantidade..."
                      name="quantidade"
                      style={{ height: '45px' }}
                      value={formData.quantidade}
                      onChange={handleInputChangeSupportControl}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Preço *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control input-create input-date bg-dark-custom"
                        placeholder="1000,00"
                        name="preco"
                        style={{ height: '45px', paddingLeft: '35px' }}
                        value={formData.preco}
                        onChange={handleInputChangeSupportControl}
                        required
                      />
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#adb5bd',
                          fontSize: '14px',
                          pointerEvents: 'none',
                        }}
                      >
                        R$
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>
                      Comprovante *
                      <small style={{ color: '#adb5bd', fontSize: '14px' }}> (Max: 10MB)</small>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="file"
                        name="arquivo"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChangeSupportControl}
                        required
                        style={{
                          position: 'absolute',
                          opacity: 0,
                          width: '100%',
                          height: '45px',
                          cursor: 'pointer',
                          zIndex: 2,
                        }}
                      />
                      <div
                        className="form-control input-create input-date bg-dark-custom d-flex align-items-center justify-content-between"
                        style={{
                          height: '45px',
                          cursor: 'pointer',
                          border: '1px solid #495057',
                          borderRadius: '8px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            color: formData.arquivo ? '#ffffff' : '#adb5bd',
                            fontSize: '14px',
                            marginLeft: '12px',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formData.arquivo ? formData.arquivo.name : 'Selecionar arquivo...'}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-light btn-sm"
                          style={{
                            margin: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            pointerEvents: 'none',
                            borderColor: '#6c757d',
                            color: '#adb5bd',
                          }}
                        >
                          Procurar
                        </button>
                      </div>
                    </div>
                    <div style={{ minHeight: '24px', marginTop: '8px' }}>
                      {formData.arquivo ? (
                        <small className="ms-3" style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>✓</span>
                          <span>Arquivo selecionado</span>
                        </small>
                      ) : (
                        <small className="ms-3" style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>⚠</span>
                          <span>Arquivo obrigatório</span>
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr style={{ margin: '30px 0 20px 0', borderColor: '#495057' }} />
          <div className='d-flex justify-content-end' style={{ padding: '0 20px 10px 20px' }}>
            <button
              type="button"
              className="btn btn-success"
              style={{ minWidth: '120px', padding: '12px 24px' }}
              onClick={handleCreate}
              disabled={!isFormValidSupportControl() || isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="modal-delete-support-title"
        aria-describedby="modal-delete-support-description"
      >
        <Box sx={styleDelete}>
          <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
            <Subtitle subtitle={`Certeza que deseja remover ${selectedItem?.nome}`} />
          </div>
          <div className='w-100 d-flex flex-column mt-5 pb-3' style={{ width: '95%' }}>
            <div className="d-flex justify-content-center gap-5">
              <button type="button" className="btn btn-success align-self-center" style={{ width: 'auto' }} onClick={handleDelete}>Sim</button>
              <button type="button" className="btn btn-secondary align-self-center" style={{ width: 'auto', backgroundColor: '#626262' }} onClick={handleCloseConfirmDelete}>Não</button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
