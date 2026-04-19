import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import { useRouter } from 'next/router';
import { getAthleteById } from '@/lib/http-service/athletes';
import { Box, Modal, Pagination} from "@mui/material";
import AddButton from '@/components/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faXmark, faTrashCan, faDownload } from '@fortawesome/free-solid-svg-icons';
import { createAthleteRelationship, createSupportControl, deleteSupportControl, getAthleteRelationship, getSupportControl } from '@/lib/http-service/relationship';
import Subtitle from '@/components/Subtitle';
import { getObservations, saveObservations } from '@/lib/http-service/observations';
import  Performance  from '@/components/Performance'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast, showErrorToast, showWarningToast } from '@/lib/toast-error';
import moment from 'moment';
import Loading from 'react-loading';
import Image from "next/image";
import { jwtDecode } from 'jwt-decode';
import ContractHistory from '@/components/modal/ContractHistory';
import { Midia } from '@/components/Midia';
import { getPhysical } from '@/lib/http-service/physical';
import type { AthleteDetail as AthleteDetailType, Relationship, SupportControl, UserPermissions, DecodedToken, Observation } from '@/types';


moment.locale('pt-br');

const styleSidebar = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-secondary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto',
  overflowX: 'hidden'
};

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

const styleDelete = {
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
  height: 'auto',
  overflow: 'auto'
};

const styleSupportControl = {
  position: 'absolute' as 'absolute',
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
  overflowX: 'hidden'
};

export default function AthleteDetail() {
  const effectRan = useRef(false);
  const { query } = useRouter();
  const athleteId = query?.id as string;
  const [tabAtual, setTabAtual] = useState<string>('relationship')
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState<AthleteDetailType>();
  const [pageRalationship, setPageRalationship] = useState(1);
  const [pageSupportControl, setPageSupportControl] = useState(1);
  const [displayedDataRelationShip, setDisplayedDataRelationShip] = useState<Relationship[]>([]);
  const [displayedDataSupportControl, setDisplayedDataSupportControl] = useState<SupportControl[]>([]);
  const [displayedTotalValueSupportControl, setDisplayedTotalValueSupportControl] = useState<string>();
  const [openCreateQuestionaryRelationship, setOpenCreateQuestionaryRelationship] = useState(false);
  const [openCreateSupportControl, setOpenCreateSupportControl] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [totalRowRelationship, setTotalRowRelationship] = useState<number>(1);
  const [totalRowSupportControl, setTotalRowSupportControl] = useState<number>(1);
  const [permissions, setPermissions] = useState<UserPermissions>({relationship: false, performance: false});

  useEffect(() => {
    const token = localStorage.getItem("token");
        const decoded = jwtDecode<DecodedToken>(token!);
        if (token) {
      setPermissions({
        relationship: decoded.permissions.includes("create_relacionamento"),
        performance: decoded.permissions.includes("create_desempenho")
      });
    }
    if(!decoded.permissions.includes("create_relacionamento")){
      setTabAtual('performance')
    }
  }, []);

  const [observacao, setObservacao] = useState<string>('');


  const [formDataRelationship, setFormDataRelationship] = useState<Record<string, any>>({
    atleta_id: athleteId,
    receptividade_contrato: '',
    satisfacao_empresa: '',
    satisfacao_clube: '',
    relacao_familiares: '',
    influencias_externas: '',
    pendencia_empresa: '',
    pendencia_clube: '',
    data_avaliacao: ''
  });

  const [formDataSupportControl, setFormDataSupportControl] = useState<Record<string, any>>({
    atleta_id: athleteId,
    nome: '',
    quantidade: '',
    preco: '',
    data_controle: '',
    arquivo: null,
  });
  const [formSupportControlSelected, setFormSupportControlSelected] = useState<Record<string, any>>({
    controle: '',
    index: ''
  })

  

  const handleDeleteControle = async () => {
    try {
      const response = await deleteSupportControl(formSupportControlSelected.controle.controle_id)
      if (response) {
        setPageSupportControl(1)
        const supportControl = await getSupportControl(athleteId, pageSupportControl);
        setDisplayedDataSupportControl(supportControl?.data.data.controles);
        setTotalRowSupportControl(supportControl?.data.total);
        setDisplayedTotalValueSupportControl(supportControl?.data.data.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
        handleCloseConfirmDeleteControl();
        showSuccessToast(`${formSupportControlSelected.controle.nome} foi deletado com sucesso`);
      } 
    } catch (error: any) {
      handleCloseConfirmDeleteControl();
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao deletar o registro. Tente novamente.');
      console.log(error);
    }
  }

  useEffect(() => {
    if (!effectRan.current) {

      const fetchAthletesData = async () => {
        setLoading(true);
        if(athleteId){
          try {
            // Atleta
            const [athleteData, athletePhysicalData] = await Promise.all([
              getAthleteById(athleteId), getPhysical(athleteId, 1, 'fisico', 1)
            ]);

            const latestPhysical = athletePhysicalData?.data?.at(-1); // Get the last element

            const mergedData = {
              ...athleteData?.data,
              physical: latestPhysical || {} // Store it as an object instead of an array
          };
            
            setAthlete(mergedData as AthleteDetailType);
  
            // Relacionamento
            const relationship = await getAthleteRelationship(athleteId, pageRalationship);
            setDisplayedDataRelationShip(relationship?.data.data);
            setTotalRowRelationship(relationship?.data.total);
  
            // Controle de Suporte
            const supportControl = await getSupportControl(athleteId, pageSupportControl);
            setDisplayedDataSupportControl(supportControl?.data.data.controles);
            setDisplayedTotalValueSupportControl(supportControl?.data.data.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));



            setTotalRowSupportControl(supportControl?.data.total);
  
            // Observações
            const responseObservacoes = await getObservations(athleteId, 'relacionamento');
            if(responseObservacoes.data){
              // let observacao = responseObservacoes?.data[responseObservacoes?.data]
              setObservacao(responseObservacoes.data.descricao);
            }
  
          } catch (error:any) {
            showErrorToast('Dados do atleta temporariamente indisponível');
            console.error('Error fetching athletes:', error);
          } finally{
            setLoading(false);
          }
        }
      };

      fetchAthletesData();
      effectRan.current = true;
    }
  }, [athleteId, pageRalationship, pageSupportControl]);

  // Update atleta_id in formDataSupportControl when athleteId becomes available
  useEffect(() => {
    if (athleteId) {
      setFormDataSupportControl(prevState => ({
        ...prevState,
        atleta_id: athleteId
      }));
    }
  }, [athleteId]);

  // Relacionamento
  const handleChangePageRalationship = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageRalationship(newPage);
  };
  const handleOpenCreateQuestionaryRelationship = () => setOpenCreateQuestionaryRelationship(true);
  const handleCloseCreateQuestionaryRelationship = () => {
    setOpenCreateQuestionaryRelationship(false)
    setFormDataRelationship({
      atleta_id: athleteId,
      receptividade_contrato: '',
      satisfacao_empresa: '',
      satisfacao_clube: '',
      relacao_familiares: '',
      influencias_externas: '',
      pendencia_empresa: '',
      pendencia_clube: '',
      data_avaliacao: ''
    });
  }

  const [isSavingRelationship, setIsSavingRelationship] = useState(false);

  const handleSalvarClickRelationShip = async () => {
    setIsSavingRelationship(true);
    try {
      const form = {
        ...formDataRelationship,
        atleta_id: athleteId,
        pendencia_empresa: formDataRelationship['pendencia_empresa'] === 'true',
        pendencia_clube: formDataRelationship['pendencia_clube'] === 'true',
      };
      await createAthleteRelationship(form as any);
      handleCloseCreateQuestionaryRelationship();
      setFormDataRelationship({
        atleta_id: athleteId,
        receptividade_contrato: '',
        satisfacao_empresa: '',
        satisfacao_clube: '',
        relacao_familiares: '',
        influencias_externas: '',
        pendencia_empresa: '',
        pendencia_clube: '',
        data_avaliacao: ''
      });
      const relationship = await getAthleteRelationship(athleteId, 1);
      setDisplayedDataRelationShip(relationship?.data.data);
      setTotalRowRelationship(relationship?.data.total);
      setPageRalationship(1);
      showSuccessToast('Relacionamento criado com sucesso!');
    } catch (error:any) {
      console.error('Error:', error);
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao salvar relacionamento. Tente novamente.');
    } finally {
      setIsSavingRelationship(false);
    }
  };

  const isFormValidRelationship = () => {
    if (
      (formDataRelationship?.atleta_id ?? '').trim() !== '' &&
      (formDataRelationship?.receptividade_contrato ?? '').trim() !== '' &&
      (formDataRelationship?.satisfacao_empresa ?? '').trim() !== '' &&
      (formDataRelationship?.satisfacao_clube ?? '').trim() !== '' &&
      (formDataRelationship?.relacao_familiares ?? '').trim() !== '' &&
      (formDataRelationship?.influencias_externas ?? '').trim() !== '' &&
      (formDataRelationship?.pendencia_empresa ?? '').trim() !== '' &&
      (formDataRelationship?.pendencia_clube ?? '').trim() !== '' &&
      (formDataRelationship?.data_avaliacao ?? '').trim() !== ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleInputChangeRelationship = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormDataRelationship((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Controle de Suporte
  const handleOpenCreateSupportControl = () => setOpenCreateSupportControl(true);
  const handleCloseCreateSupportControl = () => {
    setOpenCreateSupportControl(false)
    setFormDataSupportControl({
      atleta_id: athleteId,
      nome: '',
      quantidade: '',
      preco: '',
      data_controle: '',
      arquivo: null,
    });
  }

  // Modal SideBar
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => {
    setOpenSideBar(false)
  }

  const handleChangePageSupportControl = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageSupportControl(newPage);
  };

  const handleDownloadFile = async (supportControl: any) => {
    try {
      
      if (supportControl?.arquivo_url || supportControl?.arquivo_path) {
        // If we have a direct URL or path, create a download link
        const downloadUrl = supportControl.arquivo_url || supportControl.arquivo_path;
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `comprovante_${supportControl.nome}_${supportControl.id || 'arquivo'}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccessToast('Download iniciado com sucesso!');
      } else if (supportControl?.id) {
        // If we need to fetch from an API endpoint
        const response = await fetch(`/api/support-control/${supportControl.id}/download`);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `comprovante_${supportControl.nome}_${supportControl.id}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          showSuccessToast('Download concluído com sucesso!');
        } else {
          showErrorToast('Erro ao baixar o arquivo. Tente novamente.');
        }
      } else {
        showWarningToast('Arquivo não disponível para download.');
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      showErrorToast('Erro ao baixar o arquivo. Verifique sua conexão e tente novamente.');
    }
  };

  // Currency formatting functions
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
    let decimalPart = parts[1] || '';
    
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

  const handleInputChangeSupportControl = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    if (name === 'preco') {
      // Store raw value with basic validation
      const formattedValue = formatCurrency(value);
      
      setFormDataSupportControl((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormDataSupportControl((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

    const handleFileChangeSupportControl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        showErrorToast('Arquivo muito grande. Tamanho máximo: 10MB');
        event.target.value = ''; // Clear the input
        setFormDataSupportControl((prevState) => ({
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
        setFormDataSupportControl((prevState) => ({
          ...prevState,
          arquivo: null,
        }));
        return;
      }
    }
    
        setFormDataSupportControl((prevState) => ({
          ...prevState,
          arquivo: file,
        }));
  };

  const [isSavingSupportControl, setIsSavingSupportControl] = useState(false);

  const handleSalvarClickSupportControl = async () => {
    if (!isFormValidSupportControl()) {
      showErrorToast('Por favor, preencha todos os campos obrigatórios, incluindo o arquivo.');
      return;
    }

    setIsSavingSupportControl(true);
    try {
      const formData = new FormData();
      formData.append('atleta_id', athleteId?.toString() || '');
      formData.append('nome', formDataSupportControl.nome);
      formData.append('quantidade', formDataSupportControl.quantidade);
      formData.append('preco', parseCurrencyToFloat(formDataSupportControl.preco).toFixed(2));
      formData.append('data_controle', formDataSupportControl.data_controle);
      formData.append('arquivo', formDataSupportControl.arquivo);

      const response = await createSupportControl(formData);

      handleCloseCreateSupportControl();

      setFormDataSupportControl({
        atleta_id: athleteId,
        nome: '',
        quantidade: '',
        preco: '',
        data_controle: '',
        arquivo: null,
      });
      setPageSupportControl(1);
      const supportControl = await getSupportControl(athleteId, pageSupportControl);
      setDisplayedDataSupportControl(supportControl?.data.data.controles);
      setTotalRowSupportControl(supportControl?.data.total);
      setDisplayedTotalValueSupportControl(supportControl?.data.data.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));

      showSuccessToast('Controle de suporte criado com sucesso!');
    } catch (error:any) {
      console.error('Error:', error);

      let errorMessage = 'Erro ao criar controle de suporte. Tente novamente.';
      if (error?.response?.data?.errors?.[0]?.message) {
        errorMessage = error.response.data.errors[0].message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showErrorToast(errorMessage);
    } finally {
      setIsSavingSupportControl(false);
    }
  };

  const isFormValidSupportControl = () => {
    const precoValue = parseCurrencyToFloat(formDataSupportControl?.preco || '');
    
    return (
      (formDataSupportControl?.atleta_id ?? '').toString().trim() !== '' &&
      (formDataSupportControl?.nome ?? '').trim() !== '' &&
      (formDataSupportControl?.quantidade ?? '').toString().trim() !== '' &&
      (formDataSupportControl?.preco ?? '').trim() !== '' && precoValue > 0 &&
      (formDataSupportControl?.data_controle ?? '').trim() !== '' &&
      formDataSupportControl?.arquivo !== null
    );
  };

  const setTab = (tab: string) => {
    setTabAtual(tab)
  }

  const handleInputObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacao(event.target.value)
  };

  const handleSaveObservation = async () => {
    try {
      const request: Observation = {
        atleta_id: athleteId,
        tipo: "relacionamento" as const,
        descricao: observacao
      }
      await saveObservations(request);
      showSuccessToast('Observação salva com sucesso!');
    } catch (error:any) {
      showErrorToast(error?.response?.data?.errors?.[0]?.message || 'Erro ao salvar observação. Tente novamente.');
      console.error('Error:', error);
    }
  };

  const [openConfirmDeleteControl, setOpenConfirmDeleteControl] = React.useState(false);
  const handleOpenConfirmDeleteControl = (controle: any, index: number) => {
    setFormSupportControlSelected({
      controle: controle,
      index: index
    })
    setOpenConfirmDeleteControl(true)
    
  };

  const handleCloseConfirmDeleteControl= () => {
    setOpenConfirmDeleteControl(false)
  };

  const [openContractHistory, setOpenContractHistory] = React.useState(false);
  const handleOpenContractHistory = () => setOpenContractHistory(true);

  const handleCloseContractHistory = () => {
    setOpenContractHistory(false)
  };

  const handleCloseContractHistoryUpdateData = () => {
    const fetchAthletesData = async () => {
      setLoading(true);
      try {
        // Atleta
        const athleteData = await getAthleteById(athleteId as string);
        setAthlete(athleteData?.data as AthleteDetailType);

      } catch (error:any) {
        showErrorToast('Dados do atleta temporariamente indisponível');
        console.error('Error fetching athletes:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchAthletesData();
    setOpenContractHistory(false)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: '150px' }}>
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="row justify-content-start avatar">
        <div onClick={handleOpenSideBar}>
          <Image
          className="rounded mt-3 avatar"
          src="/images/icon-user.png"
          width={10}
          height={10}
          alt="Athlete logo"
          layout="responsive"
          objectFit="cover"
          />
        </div>
        <div className="col-lg-2">
          <SideBar athleteData={athlete!} modal={false} />
        </div>
        <div className="col-lg-10">
          <ul className="nav nav-tabs">
            {
              permissions.relationship === true && (
                <li className="nav-item me-1 menu" style={{cursor: 'pointer'}}>
                  <a className={ tabAtual === 'relationship' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => setTab('relationship')}>Relacionamento</a>
                </li>
              )}
            {
              permissions.performance && (
              <li className="nav-item me-1 menu" style={{cursor: 'pointer'}}>
                <a className={ tabAtual === 'performance' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => setTab('performance')}>Desempenho</a>
              </li>
              )}
              <li className="nav-item menu" style={{cursor: 'pointer'}}>
                <a className={ tabAtual === 'midia' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => setTab('midia')}>Imagem / Vídeo / Links</a>
              </li>
          </ul>
          {
          tabAtual === 'relationship' &&
          <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>

            <div className='mt-5 d-flex justify-content-center modal-contrato'>
              <button type="button" className="btn btn-modal-color w-75 mb-3 w-100" onClick={handleOpenContractHistory}>Histórico de Contratos</button>
            </div>

            <div className='d-flex justify-content-end mt-3' style={{ marginRight: '30px' }}>
              <div onClick={handleOpenCreateQuestionaryRelationship} className='margin-button-control-relationship'>
                <AddButton />
              </div>
              <div>
              </div>
            </div>
            <div className="m-3" style={{maxHeight: '300px', overflow: 'auto'}}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">DATA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">RECEPTIVIDADE CONTRATO</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">SATISFAÇÃO EMPRESA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">SATISFAÇÃO CLUBE</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">RELAÇÕES FAMILIARES</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">INFLUÊNCIA EXTERNAS</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">PENDÊNCIAS EMPRESA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">PENDÊNCIAS CLUBE</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedDataRelationShip.length > 0 ? (
                      Array.isArray(displayedDataRelationShip) && displayedDataRelationShip.map((relationship: any, index: number) => (
                        <tr key={index}>
                        <td className="table-dark text-center">{moment(relationship.data_avaliacao).format('DD/MM/YYYY')}</td>
                        <td className="table-dark text-center">{relationship.receptividade_contrato}</td>
                        <td className="table-dark text-center">{relationship.satisfacao_empresa}</td>
                        <td className="table-dark text-center">{relationship.satisfacao_clube}</td>
                        <td className="table-dark text-center">{relationship.relacao_familiares}</td>
                        <td className="table-dark text-center">{relationship.influencias_externas}</td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon icon={relationship.pendencia_empresa ? faCheck : faXmark} size='xl' style={relationship.pendencia_empresa ? { color: "#ff0000" } : { color: "#15ff00" }} />
                        </td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon icon={relationship.pendencia_clube ? faCheck : faXmark} size='xl' style={relationship.pendencia_clube ? { color: "#ff0000" } : { color: "#15ff00" }} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="table-dark text-center">Não possui relacionamento</td>
                    </tr>
                  )
                  } 
                </tbody>
              </table>
              {
                totalRowRelationship > 5 &&
                <div className='w-100 d-flex justify-content-center'>
                  <Pagination
                    className="pagination-bar"
                    count={Math.ceil(totalRowRelationship / 5)}
                    page={pageRalationship}
                    onChange={handleChangePageRalationship}
                    variant="outlined"
                    size="large"
                    sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
                  />
                </div>
              }
            </div>
            <hr />
            <div className='row mt-3'>
              <div className="col-md d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool">
                <div className='d-flex justify-content-between align-items-center w-100 p-2'>
                  <div>
                    <Subtitle subtitle='Controle de Suportes' />
                  </div>
                  <div onClick={handleOpenCreateSupportControl} className='margin-button-control-support'>
                    <AddButton />
                  </div>
                </div>
                <div className="mt-3 table-custom-control" style={{maxHeight: '300px', overflow: 'auto', width: '95%'}}>
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
                      {
                        displayedDataSupportControl.length > 0 ? (
                        Array.isArray(displayedDataSupportControl) && displayedDataSupportControl.map((supportContol,index) => (
                          <tr key={index}>
                            <td className="table-dark text-center">{moment(supportContol.data_controle).format('DD/MM/YYYY')}</td>
                            <td className="table-dark text-center">{supportContol.nome}</td>
                            <td className="table-dark text-center">{supportContol.quantidade}</td>
                            <td className="table-dark text-center">{supportContol.preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                            <td className="table-dark text-center">
                              <div className="d-flex justify-content-center gap-3">
                                {supportContol.arquivo_url ? (
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    size="lg"
                                    style={{ color: "#28a745", cursor: 'pointer' }}
                                    onClick={() => handleDownloadFile(supportContol)}
                                    title="Baixar comprovante"
                                  />
                                ) : (
                                  // placeholder keeps spacing so trash icon doesn't shift when download icon is missing
                                  <span aria-hidden style={{ display: 'inline-block', width: 20, height: 24 }} />
                                )}
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  size="lg"
                                  style={{ color: "#ff0000", cursor: 'pointer' }}
                                  onClick={() => handleOpenConfirmDeleteControl(supportContol, index)}
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
                        )
                      }
                    </tbody>
                  </table>
                  <table>
                    <tbody className="table table-striped">
                      <tr>
                        <th className="table-dark text-center p-2">Total</th>
                        <td className="table-dark text-center table-custom p-2">{displayedTotalValueSupportControl}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center mt-3'>
                    {
                      totalRowSupportControl > 3 &&
                      <Pagination
                        className="pagination-bar"
                        count={Math.ceil(totalRowSupportControl / 3)}
                        page={pageSupportControl}
                        onChange={handleChangePageSupportControl}
                        variant="outlined"
                        size="large"
                        sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'var(--bg-ternary-color)', color: 'white' }, '& .MuiPaginationItem-page': {color: 'white'}, '& .MuiPaginationItem-icon': {color: 'white'} }}
                      />
                    }
                  </div>
                  </div>
                </div>
              <div className='col-md'>
                <div className='ms-3 me-3 d-flex flex-column mb-3'>
                  <label style={{ width: '100%' }}>
                    <Subtitle subtitle='Observações' />
                    <textarea onChange={handleInputObservation} value={observacao} rows={6} style={{ width: '100%' }}/>
                  </label>
                  <button type="button" className="btn btn-success align-self-end" style={{ width: '170px' }} onClick={handleSaveObservation} disabled={!observacao.trim()}>Salvar Observações</button>
                </div>
              </div>
            </div>
          </div>

          }
          {
          tabAtual === 'performance' &&
          // Desempenho
          <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>
            <Performance athleteData={athlete!} />
          </div>
          }

          {
            tabAtual === 'midia' &&
            <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>
            <Midia />
          </div>
          }

          
        </div>
      </div>

      {/* Modal */}
      {/* Relacionamento */}
      <Modal
        open={openCreateQuestionaryRelationship}
        onClose={handleCloseCreateQuestionaryRelationship}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForm}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Criar Questionário de relacionamento"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseCreateQuestionaryRelationship}
/>
          </div>
          <hr />
          <div className="row" style={{height:'auto'}}>
              <div className='col-md-6'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_avaliacao" style={{height:'45px'}} value={formDataRelationship.data_avaliacao} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Receptividade Contrato</label>
                    <select className="form-select" name="receptividade_contrato" value={formDataRelationship.receptividade_contrato} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.receptividade_contrato ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>


                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Empresa</label>
                    <select className="form-select" name="satisfacao_empresa" value={formDataRelationship.satisfacao_empresa} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.satisfacao_empresa ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>

                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Clube</label>
                    <select className="form-select" name="satisfacao_clube" value={formDataRelationship.satisfacao_clube} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.satisfacao_clube ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>
              </div>
              <div className='col-md-6'>
              <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Relação Familiares</label>
                    <select className="form-select" name="relacao_familiares" value={formDataRelationship.relacao_familiares} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.relacao_familiares ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Influencia Externa</label>
                    <select className="form-select" name="influencias_externas" value={formDataRelationship.influencias_externas} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.influencias_externas ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Pendências Empresa</label>
                    <select className="form-select" name="pendencia_empresa" value={formDataRelationship.pendencia_empresa} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.pendencia_empresa ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Pendência Clube</label>
                    <select className="form-select" name="pendencia_clube" value={formDataRelationship.pendencia_clube} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.pendencia_clube ? '#fff' : '#999'}}>
                      <option value="" disabled hidden style={{color: '#999'}}>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                </div>
              </div>
          <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClickRelationShip} disabled={!isFormValidRelationship() || isSavingRelationship}>
              {isSavingRelationship ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
            </div>

        </Box>
      </Modal>
      {/* Controle de Suporte */}
      <Modal
        open={openCreateSupportControl}
        onClose={handleCloseCreateSupportControl}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleSupportControl}>
          <div className="d-flex justify-content-between align-items-center" style={{marginBottom: '20px'}}>
            <div>
              <Subtitle subtitle="Criar Controle de Suporte"/>
              <small style={{color: '#adb5bd', marginLeft: '3px'}}>Preencha todos os campos obrigatórios (*)</small>
            </div>
            <FontAwesomeIcon 
              icon={faX} 
              style={{color: "#ffffff", cursor: 'pointer', padding: '8px'}} 
              size="lg" 
              onClick={handleCloseCreateSupportControl}
            />
          </div>
          <hr style={{margin: '0 0 25px 0', borderColor: '#495057'}} />
          <div className="row" style={{minHeight: 'auto', paddingBottom: '20px'}}>
            <div className="col-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '18px', marginBottom: '8px'}}>Data *</label>
                    <input 
                      type="date" 
                      className="form-control input-create input-date bg-dark-custom" 
                      placeholder="selecione a data" 
                      name="data_controle" 
                      style={{height:'45px'}} 
                      value={formDataSupportControl.data_controle} 
                      onChange={handleInputChangeSupportControl}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '18px', marginBottom: '8px'}}>Nome *</label>
                    <input 
                      type="text" 
                      className="form-control input-create input-date bg-dark-custom" 
                      placeholder="Digite o nome..." 
                      name="nome" 
                      style={{height:'45px'}} 
                      value={formDataSupportControl.nome} 
                      onChange={handleInputChangeSupportControl}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '18px', marginBottom: '8px'}}>Quantidade *</label>
                    <input 
                      type="number" 
                      className="form-control input-create input-date bg-dark-custom" 
                      placeholder="Digite a quantidade..." 
                      name="quantidade" 
                      style={{height:'45px'}} 
                      value={formDataSupportControl.quantidade} 
                      onChange={handleInputChangeSupportControl}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '18px', marginBottom: '8px'}}>Preço *</label>
                    <div style={{position: 'relative'}}>
                      <input 
                        type="text" 
                        className="form-control input-create input-date bg-dark-custom" 
                        placeholder="1000,00" 
                        name="preco" 
                        style={{height:'45px', paddingLeft: '35px'}} 
                        value={formDataSupportControl.preco} 
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
                          pointerEvents: 'none'
                        }}
                      >
                        R$
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '18px', marginBottom: '8px'}}>
                      Comprovante * 
                      <small style={{color: '#adb5bd', fontSize: '14px'}}> (Max: 10MB)</small>
                    </label>
                    <div style={{position: 'relative'}}>
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
                          zIndex: 2
                        }}
                      />
                      <div 
                        className="form-control input-create input-date bg-dark-custom d-flex align-items-center justify-content-between"
                        style={{
                          height:'45px', 
                          cursor: 'pointer',
                          border: '1px solid #495057',
                          borderRadius: '8px',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <span style={{
                          color: formDataSupportControl.arquivo ? '#ffffff' : '#adb5bd',
                          fontSize: '14px',
                          marginLeft: '12px',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {formDataSupportControl.arquivo ? formDataSupportControl.arquivo.name : 'Selecionar arquivo...'}
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
                            color: '#adb5bd'
                          }}
                        >
                          Procurar
                        </button>
                      </div>
                    </div>
                    <div style={{minHeight: '24px', marginTop: '8px'}}>
                      {formDataSupportControl.arquivo ? (
                        <small className="ms-3" style={{color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '16px'}}>✓</span>
                          <span>Arquivo selecionado</span>
                        </small>
                      ) : (
                        <small className="ms-3" style={{color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span style={{fontSize: '16px'}}>⚠</span>
                          <span>Arquivo obrigatório</span>
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{margin: '30px 0 20px 0', borderColor: '#495057'}} />
          <div className='d-flex justify-content-end' style={{padding: '0 20px 10px 20px'}}>
            <button 
              type="button" 
              className="btn btn-success" 
              style={{minWidth: '120px', padding: '12px 24px'}} 
              onClick={handleSalvarClickSupportControl}
              disabled={!isFormValidSupportControl() || isSavingSupportControl}
            >
              {isSavingSupportControl ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Box>
      </Modal>
        {/* SideBar Responsivo */}
        <Modal
        open={openSideBar}
        onClose={handleCloseSideBar}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleSidebar}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Detalhe do atleta"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseSideBar}/>
          </div>
          <hr />
          <SideBar athleteData={athlete!} modal={true}/>
        </Box>
      </Modal>
      {/* Histórico de contratos */}
      <Modal
        open={openContractHistory}
        onClose={handleCloseContractHistory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <ContractHistory closeModal={handleCloseContractHistory} athleteId={athleteId} closeModalUpdateData={handleCloseContractHistoryUpdateData}/>
        </Box>
      </Modal>
      {/* Delete Controle Suporte */}
      <Modal
        open={openConfirmDeleteControl}
        onClose={handleCloseConfirmDeleteControl}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleDelete}>
          <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
            <Subtitle subtitle={`Certeza que deseja remover ${formSupportControlSelected.controle.nome}`}/>
          </div>
          <div className='w-100 d-flex flex-column mt-5 pb-3' style={{width: '95%'}}>
                <div className="d-flex justify-content-center gap-5">
                  <button type="button" className="btn btn-success align-self-center" style={{width:'auto'}} onClick={handleDeleteControle}>Sim</button>
                  <button type="button" className="btn btn-secondary align-self-center" style={{width:'auto', backgroundColor: '#626262'}} onClick={handleCloseConfirmDeleteControl} >Não</button>
                </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}
