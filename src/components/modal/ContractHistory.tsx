import React, { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDownload, faEye, faPenSquare, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createInjuries, getInjuries } from '@/lib/http-service/injuries';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { createContract, editContract, getContract } from '@/lib/http-service/contract';
import ContractHistoryVersion from './ContractHistoryVersion';

interface Athlete {
  id: number;
  nome: string;
  posicao: string;
  data_nascimento: string;
  clube_atual: string;
}

const styleList = {
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

export default function ContractHistory({closeModal, athleteId, closeModalUpdateData}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [openRegisterContractHistory, setOpenRegisterContractHistory] = useState(false);
  const [openContractHistoryVersion, setOpenContractHistoryVersion] = useState(false);
  const [contractId, setContractId] = useState<number | null>(null);
  const [openEditContract, setOpenEditContract] = useState(false);
  const [totalRow, setTotalRow] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [contractHistory, setContractHistory] = useState<any[]>([]);
  const [formRegisterContractHistory, setFormRegisterContractHistory] = useState<Record<string, any>>({
    atleta_id: athleteId,
    contrato_sub_tipo_id: '',
    data_inicio: '',
    data_termino: '',
    observacao: '',
    arquivo: null as File | null,
  });

  const [alterou, setAlterou] = useState<boolean>(false)


  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        setLoading(true)
        try {
          const contractHistoryList = await getContract(athleteId, page);
          setContractHistory(contractHistoryList?.data ?? []);
          setTotalRow(contractHistoryList?.total ?? 0);
        } catch (error:any) {
          console.error('Error:', error);
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
      contrato_sub_tipo_id: '',
      data_inicio: '',
      data_termino: '',
      observacao: '',
      arquivo: null,
    });
  }

  const handleOpenContractHistoryVersion = (id: number) => {
    setContractId(id);
    setOpenContractHistoryVersion(true);
  };
  const handleCloseContractHistoryVersion = () => {
    setContractId(null);
    setOpenContractHistoryVersion(false);
  }

  const convertIdSubTypeContract = (subContract: string) => {
    switch(subContract) {
      case 'Imagem': 
        return 1;
      case 'Agenciamento': 
        return 2;
      case 'Profissional': 
        return 3;
      case 'Amador': 
        return 4;
      case 'Formação': 
        return 5;
      case 'Empresa': 
        return 6;
      default:
        return '';
    }
  }

  const handleOpenEditContract = (contract: Record<string, unknown>) => {
    setOpenEditContract(true)
    setFormRegisterContractHistory({
      atleta_id: athleteId,
      data_inicio: contract.data_inicio,
      data_termino: contract.data_termino,
      observacao: contract.observacao,
      contrato_id: contract.contrato_id,
      ativo: contract.ativo,
      arquivo_url: contract.arquivo_url || null,
      arquivo: null,
    })
  };
  const handleCloseEditContract = () => {
    setOpenEditContract(false)
    setFormRegisterContractHistory({
      atleta_id: athleteId,
      contrato_sub_tipo_id: '',
      data_inicio: '',
      data_termino: '',
      observacao: '',
      arquivo: null,
    });
  }

    const handleInputChangeRegisterContractHistory = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFormRegisterContractHistory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChangeContract = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('Arquivo muito grande. Tamanho máximo: 10MB');
        event.target.value = '';
        setFormRegisterContractHistory((prevState: any) => ({ ...prevState, arquivo: null }));
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de arquivo não suportado. Use apenas PDF, JPG, JPEG ou PNG');
        event.target.value = '';
        setFormRegisterContractHistory((prevState: any) => ({ ...prevState, arquivo: null }));
        return;
      }
    }
    setFormRegisterContractHistory((prevState: any) => ({
      ...prevState,
      arquivo: file,
    }));
  };

  const handleDownloadContractFile = async (contract: any) => {
    try {
      if (contract?.arquivo_url) {
        const link = document.createElement('a');
        link.href = contract.arquivo_url;
        link.download = `contrato_${contract.contrato_nome || ''}_${contract.contrato_id || 'arquivo'}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download iniciado com sucesso!');
      } else {
        toast.warning('Arquivo não disponível para download.');
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar o arquivo. Verifique sua conexão e tente novamente.');
    }
  };

  const handleSaveRegisterContractHistory = async () => {
    setLoading(true);
    try {
      let requestData: any;
      if (formRegisterContractHistory.arquivo) {
        const formData = new FormData();
        formData.append('atleta_id', formRegisterContractHistory.atleta_id?.toString() || '');
        formData.append('contrato_sub_tipo_id', formRegisterContractHistory.contrato_sub_tipo_id?.toString() || '');
        formData.append('data_inicio', formRegisterContractHistory.data_inicio);
        formData.append('data_termino', formRegisterContractHistory.data_termino);
        formData.append('observacao', formRegisterContractHistory.observacao || '');
        formData.append('arquivo', formRegisterContractHistory.arquivo);
        requestData = formData;
      } else {
        requestData = formRegisterContractHistory;
      }
      const response = await createContract(requestData);
      if(response) {
        handleCloseRegisterContractHistory()
        setPage(1)
        const contractHistoryList = await getContract(athleteId, 1);
        setContractHistory(contractHistoryList?.data ?? []);
        setTotalRow(contractHistoryList?.total ?? 0);
      }
      setAlterou(true)
    } catch (error:any) {
      toast.error("Erro ao cadastrar contrato", {
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

  const handleSaveEditContract = async () => {
    setLoading(true);
    try {
      let requestData: any;
      if (formRegisterContractHistory.arquivo) {
        const formData = new FormData();
        formData.append('contrato_id', formRegisterContractHistory.contrato_id?.toString() || '');
        formData.append('data_inicio', formRegisterContractHistory.data_inicio);
        formData.append('data_termino', formRegisterContractHistory.data_termino);
        formData.append('observacao', formRegisterContractHistory.observacao || '');
        formData.append('ativo', formRegisterContractHistory.ativo?.toString() || 'true');
        formData.append('arquivo', formRegisterContractHistory.arquivo);
        requestData = formData;
      } else {
        requestData = formRegisterContractHistory;
      }
      const response = await editContract(requestData);
      handleCloseEditContract()
      setPage(1)
      const contractHistoryList = await getContract(athleteId, 1);
      setContractHistory(contractHistoryList?.data ?? []);
      setTotalRow(contractHistoryList?.total ?? 0);
      setAlterou(true)
    } catch (error:any) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const handleChangePageContractHistory = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleCloseModal = () => {
    if(alterou){
      closeModalUpdateData();
    } else {
      closeModal();
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
                    <td className="table-dark text-end" style={{ whiteSpace: "nowrap" }}>
                      {contract.arquivo_url ? (
                        <div style={{ display: "inline-block" }} onClick={() => handleDownloadContractFile(contract)}>
                          <FontAwesomeIcon className="ms-2 me-2" icon={faDownload} size="xl" style={{ color: "#28a745", cursor: 'pointer' }} title="Baixar arquivo do contrato" />
                        </div>
                      ) : (
                        <span aria-hidden style={{ display: 'inline-block', width: 20, height: 24 }} />
                      )}
                      <div  style={{ display: "inline-block" }} onClick={() => handleOpenEditContract(contract)}>
                        <FontAwesomeIcon className="ms-2 me-2" icon={faPenSquare} style={{ color: "white", cursor: "pointer" }} size="xl" />
                      </div>
                    <div style={{ display: "inline-block" }} onClick={() => handleOpenContractHistoryVersion(contract.contrato_id)}>
                      <FontAwesomeIcon className="ms-2 me-2" icon={faEye} size="xl" style={{ color: "#ffffff", cursor: "pointer", display: "inline-block" }}/>
                    </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="table-dark text-center">Não possui Contratos</td>
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
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Contrato"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterContractHistory} />
          </div>
          <hr />
          <div className="row" style={{height:'auto'}}>
              <div className='col-md'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Início</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_inicio" style={{height:'45px'}} value={formRegisterContractHistory.data_inicio} onChange={handleInputChangeRegisterContractHistory}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Término</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_termino" style={{height:'45px'}} value={formRegisterContractHistory.data_termino} onChange={handleInputChangeRegisterContractHistory}/>
                </div>
              </div>
              <div className="input w-100 mt-3">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Tipo do Contrato</label>
                  </div>
                  <select className="form-select" name="contrato_sub_tipo_id" value={formRegisterContractHistory.contrato_sub_tipo_id} onChange={handleInputChangeRegisterContractHistory} style={{height:'45px', color: formRegisterContractHistory.contrato_sub_tipo_id ? '#fff' : '#999'}}>
                    <option value="" disabled hidden>Selecione</option>
                    <option value={1} style={{color: '#fff'}}>Imagem</option>
                    <option value={2} style={{color: '#fff'}}>Agenciamento</option>
                    <option value={6} style={{color: '#fff'}}>Garantias</option>
                    <option value={3} style={{color: '#fff'}}>Profissional</option>
                    <option value={4} style={{color: '#fff'}}>Amador</option>
                    <option value={5} style={{color: '#fff'}}>Formação</option>
                    <option value={7} style={{color: '#fff'}}>Material Esportivo</option>
                    <option value={8} style={{color: '#fff'}}>Publicidade</option>
                  </select>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Observação</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="observacao" style={{height:'45px'}} value={formRegisterContractHistory.observacao} onChange={handleInputChangeRegisterContractHistory} />
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Arquivo do Contrato</label>
                  <input
                    type="file"
                    className="form-control input-create bg-dark-custom"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChangeContract}
                    style={{height:'45px'}}
                  />
                  <small className="ms-3" style={{color: '#999'}}>PDF, JPG, JPEG ou PNG. Máximo 10MB. (Opcional)</small>
                </div>
              <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
                <button type="button" className="btn btn-success align-self-end save-contract" style={{width:'auto'}} onClick={handleSaveRegisterContractHistory}>Salvar</button>
              </div>
            </div>
          <ToastContainer />
        </Box>
      </Modal>
      <Modal
        open={openContractHistoryVersion}
        onClose={handleCloseContractHistoryVersion}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleList}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Versões do Contrato"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseContractHistoryVersion} />
          </div>
          <hr />
            <ContractHistoryVersion contractId={contractId}/>
          <ToastContainer />
        </Box>
      </Modal>
      <Modal
        open={openEditContract}
        onClose={handleCloseEditContract}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Contrato"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseEditContract} />
          </div>
          <hr />
          <div className="row" style={{height:'auto'}}>
              <div className='col-md'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Início</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_inicio" style={{height:'45px'}} value={formRegisterContractHistory.data_inicio} onChange={handleInputChangeRegisterContractHistory}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Término</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="data_termino" style={{height:'45px'}} value={formRegisterContractHistory.data_termino} onChange={handleInputChangeRegisterContractHistory}/>
                </div>
              </div>
              {/* <div className="input w-100 mt-3">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Tipo do Contrato</label>
                  </div>
                  <select className="form-select" name="contrato_sub_tipo_id" value={formRegisterContractHistory.contrato_sub_tipo_id} onChange={handleInputChangeRegisterContractHistory}>
                    <option value={1} style={{color: '#fff'}}>Imagem</option>
                    <option value={2} style={{color: '#fff'}}>Agenciamento</option>
                    <option value={3} style={{color: '#fff'}}>Profissional</option>
                    <option value={4} style={{color: '#fff'}}>Amador</option>
                    <option value={5} style={{color: '#fff'}}>Formação</option>
                    <option value={6} style={{color: '#fff'}}>Nenhum</option>
                  </select>
                </div> */}
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Observação</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="observacao" style={{height:'45px'}} value={formRegisterContractHistory.observacao} onChange={handleInputChangeRegisterContractHistory} />
                      {/* <textarea className='input-create bg-dark-custom' onChange={handleInputChangeRegisterContractHistory} value={formRegisterContractHistory.observacao} rows={6} style={{ width: '100%', height: '100px !important', border: 'var(--bg-secondary-color) 4px solid ' }}/> */}
                </div>
                <div className="mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Ativo</label>
                  <Checkbox 
                    color="success" 
                    name="ativo" 
                    onChange={(event) => setFormRegisterContractHistory((prevState: any) => ({
                      ...prevState,
                      ativo: event.target.checked,
                    }))} 
                    checked={formRegisterContractHistory.ativo} 
                    sx={{
                      color: "var(--bg-ternary-color)",
                      '&.Mui-checked': {
                        color: "var(--bg-ternary-color)",
                      },
                    }}
                  />
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Arquivo do Contrato</label>
                  {formRegisterContractHistory.arquivo_url && (
                    <small className="ms-3 mb-1" style={{color: '#28a745'}}>Arquivo atual anexado. Selecione um novo para substituir.</small>
                  )}
                  <input
                    type="file"
                    className="form-control input-create bg-dark-custom"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChangeContract}
                    style={{height:'45px'}}
                  />
                  <small className="ms-3" style={{color: '#999'}}>PDF, JPG, JPEG ou PNG. Máximo 10MB. (Opcional)</small>
                </div>
              <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
                <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaveEditContract}>Salvar</button>
              </div>
            </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
