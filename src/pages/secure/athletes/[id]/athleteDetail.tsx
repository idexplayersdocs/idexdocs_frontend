import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import { useRouter } from 'next/router';
import { getAthleteById } from '@/lib/http-service/athletes';
import { Box, Modal, Pagination} from "@mui/material";
import AddButton from '@/components/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { createAthleteRelationship, getAthleteRelationship } from '@/lib/http-service/relationship';
import Subtitle from '@/components/Subtitle';
import { getObservations, saveObservations } from '@/lib/http-service/observations';
import  Performance  from '@/components/Performance'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast, showErrorToast } from '@/lib/toast-error';
import moment from 'moment';
import Loading from 'react-loading';
import Image from "next/image";
import { jwtDecode } from 'jwt-decode';
import ContractHistory from '@/components/modal/ContractHistory';
import { Midia } from '@/components/Midia';
import { getPhysical } from '@/lib/http-service/physical';
import type { AthleteDetail as AthleteDetailType, Relationship, UserPermissions, DecodedToken, Observation } from '@/types';
import SupportControl from '@/components/SupportControl';


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

export default function AthleteDetail() {
  const effectRan = useRef(false);
  const { query } = useRouter();
  const athleteId = query?.id as string;
  const [tabAtual, setTabAtual] = useState<string>('relationship')
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState<AthleteDetailType>();
  const [pageRalationship, setPageRalationship] = useState(1);
  const [displayedDataRelationShip, setDisplayedDataRelationShip] = useState<Relationship[]>([]);
  const [openCreateQuestionaryRelationship, setOpenCreateQuestionaryRelationship] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [totalRowRelationship, setTotalRowRelationship] = useState<number>(1);
  const [permissions, setPermissions] = useState<UserPermissions>({relationship: false, performance: false});

  useEffect(() => {
    const { getStoredToken } = require("@/lib/auth");
    const token = getStoredToken();
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setPermissions({
        relationship: decoded.permissions.includes("create_relacionamento"),
        performance: decoded.permissions.includes("create_desempenho")
      });
      if(!decoded.permissions.includes("create_relacionamento")){
        setTabAtual('performance')
      }
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
  }, [athleteId, pageRalationship]);

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

  // Modal SideBar
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => {
    setOpenSideBar(false)
  }

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
            <div className='row'>
              <SupportControl athleteId={athleteId} />
              <div className='col-md d-flex flex-column align-items-center'>
                <div className='d-flex w-100 p-2 mt-1'>
                  <Subtitle subtitle='Observações' />
                </div>
                <div className='mt-3' style={{ width: '95%' }}>
                  <label style={{ width: '100%' }}>
                    <textarea onChange={handleInputObservation} value={observacao} rows={6} style={{ width: '100%', marginTop: '12px' }}/>
                  </label>
                  <button type="button" className="btn btn-success align-self-end mt-2" style={{ width: '170px' }} onClick={handleSaveObservation} disabled={!observacao.trim()}>Salvar Observações</button>
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
