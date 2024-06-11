import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import Relationship from '@/components/Relationship';
import { useRouter } from 'next/router';
import { getAthleteById } from '@/pages/api/http-service/athletes';
import { Box, Button, Modal, Pagination, colors, styled } from "@mui/material";
import Observacoes from '../../../../components/Observation';
import AddButton from '@/components/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { createAthleteRelationship, createSupportControl, getAthleteRelationship, getSupportControl } from '@/pages/api/http-service/relationship';
import Subtitle from '@/components/Subtitle';
import { getObservations, saveObservations } from '@/pages/api/http-service/observations';
import  Performance  from '@/components/Performance'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import Loading from 'react-loading';
import Image from "next/image";
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import { jwtDecode } from 'jwt-decode';
import ContractHistory from '@/components/modal/ContractHistory';
import { Midia } from '@/components/Midia';

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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AthleteDetail() {
  const effectRan = useRef(false);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  const [tabAtual, setTabAtual] = useState<string>('relationship')
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const [athlete, setAthlete] = useState<any>();
  const [pageRalationship, setPageRalationship] = useState(1);
  const [pageSupportControl, setPageSupportControl] = useState(1);
  const [displayedDataRelationShip, setDisplayedDataRelationShip] = useState<any>([]);
  const [displayedDataSupportControl, setDisplayedDataSupportControl] = useState<any>([]);
  const [displayedTotalValueSupportControl, setDisplayedTotalValueSupportControl] = useState<any>();
  const [totalPages, setTotalPages] = useState(1);
  const [openCreateQuestionaryRelationship, setOpenCreateQuestionaryRelationship] = useState(false);
  const [openCreateSupportControl, setOpenCreateSupportControl] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [totalRowRelationship, setTotalRowRelationship] = useState<number>(1);
  const [totalRowSupportControl, setTotalRowSupportControl] = useState<number>(1);
  const [permissions, setPermissions] = useState<any>({
    relationship: false,
    performance: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
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


  const [formDataRelationship, setFormDataRelationship] = useState<any>({
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

  const [formDataSupportControl, setFormDataSupportControl] = useState<any>({
    atleta_id: athleteId,
    nome: '',
    quantidade: '',
    preco: '',
    data_controle: '',
  });


  useEffect(() => {
    if (!effectRan.current) {

      const fetchAthletesData = async () => {
        setLoading(true);
        if(athleteId){
          try {
            // Atleta
            const athleteData = await getAthleteById(athleteId);
            setAthlete(athleteData?.data);
  
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
            toast.error('Dados do atleta temporariamente indisponível', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
              });
            console.error('Error fetching athletes:', error);
          } finally{
            setLoading(false);
          }
        }
      };

      fetchAthletesData();
    }
  }, [athleteId, pageRalationship, pageSupportControl]);

  // Relacionamento
  const handleChangePageRalationship = (event: any, newPage: number) => {
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

  const handleSalvarClickRelationShip = async () => {
    setLoading(true);
    try {
      formDataRelationship['atleta_id'] = athleteId
      formDataRelationship['pendencia_empresa'] = formDataRelationship['pendencia_empresa'] == 'true' ? true : false
      formDataRelationship['pendencia_clube'] = formDataRelationship['pendencia_empresa'] == 'true' ? true : false
      const response = await createAthleteRelationship(formDataRelationship);
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
      setLoading(false);
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
    setFormDataRelationship((prevState: any) => ({
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
    });
  }

  // Modal SideBar
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => {
    setOpenSideBar(false)
  }

  const handleChangePageSupportControl= (event: any, newPage:number) => {
    setPageSupportControl(newPage);
  };

  const handleInputChangeSupportControl = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormDataSupportControl((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSalvarClickSupportControl = async () => {
    setLoading(true);
    try {
      formDataSupportControl['preco'] = parseFloat(formDataSupportControl.preco).toFixed(2)
      formDataSupportControl['atleta_id'] = athleteId
      const response = await createSupportControl(formDataSupportControl);
      handleCloseCreateSupportControl();
      setFormDataSupportControl({
        atleta_id: athleteId,
        nome: '',
        quantidade: '',
        preco: '',
        data_controle: '',
      });
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
      setLoading(false);
    }
    setPageSupportControl(1)
    // await getSupportControl(athleteId, pageSupportControl);
    const supportControl = await getSupportControl(athleteId, pageSupportControl);
    setDisplayedDataSupportControl(supportControl?.data.data);
    setTotalRowSupportControl(supportControl?.data.total);
  };

  const isFormValidSupportControl= () => {
    if (
      (formDataSupportControl?.atleta_id ?? '').trim() !== '' &&
      (formDataSupportControl?.nome ?? '').trim() !== '' &&
      (formDataSupportControl?.quantidade ?? '').trim() !== '' &&
      (formDataSupportControl?.preco ?? '').trim() !== '' &&
      (formDataSupportControl?.data_controle ?? '').trim() !== ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const setTab = (tab: string) => {
    setTabAtual(tab)
  }

  const handleInputObservation = (event: any) => {
    setObservacao(event.target.value)
  };

  const handleSaveObservation = async () => {
    setLoading(true);
    try {
      const request = {
        atleta_id: athleteId,
        tipo: "relacionamento",
        descricao: observacao
      }
      const response = await saveObservations(request);
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
      console.error('Error:', error);
    } finally{
      setLoading(false);
    }
  };

  const [openContractHistory, setOpenContractHistory] = React.useState(false);
  const handleOpenContractHistory = () => setOpenContractHistory(true);
  const handleCloseContractHistory = () => setOpenContractHistory(false);

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
          <SideBar athleteData={athlete} modal={false} />
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
                <a className={ tabAtual === 'midia' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => setTab('midia')}>Imagem / Vídeo</a>
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
                    <Subtitle subtitle='Controle de Suporte' />
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
                      </tr>
                    </thead>
                    <tbody>
                      {
                        displayedDataSupportControl.length > 0 ? (
                        Array.isArray(displayedDataSupportControl) && displayedDataSupportControl.map((supportContol,index) => (
                          <tr key={index}>
                            <td className="table-dark text-center">{new Date(supportContol.data_controle).toLocaleDateString()}</td>
                            <td className="table-dark text-center">{supportContol.nome}</td>
                            <td className="table-dark text-center">{supportContol.quantidade}</td>
                            {/* <td className="table-dark text-center">R$ {supportContol.preco}</td> */}
                            <td className="table-dark text-center">{supportContol.preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="table-dark text-center">Lista vazia</td>
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
                  <button type="button" className="btn btn-success align-self-end" style={{ width: '170px' }} onClick={handleSaveObservation}>Salvar Observações</button>
                </div>
              </div>
            </div>
          </div>

          }
          {
          tabAtual === 'performance' &&
          // Desempenho
          <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>
            <Performance athleteData={athlete} />
          </div>
          }

          {
            tabAtual === 'midia' &&
            <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>
            <Midia />
          </div>
          }

          {/* Relationship */}
          
        </div>
      </div>

      {/* Modal */}
      {/* Relacionamento */}
      <Modal
        open={openCreateQuestionaryRelationship}
        onClose={handleCloseCreateQuestionaryRelationship}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Criar Questionário de relacionamento"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseCreateQuestionaryRelationship}
/>
          </div>
          <hr />
          <div className="row" style={{height:'400px'}}>
              <div className='col-md-6'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_avaliacao" style={{height:'45px'}} value={formDataRelationship.data_avaliacao} onChange={handleInputChangeRelationship}/>
                </div>
                {/* <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Receptividade Contrato</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="receptividade_contrato" style={{height:'45px'}} value={formDataRelationship.receptividade_contrato} onChange={handleInputChangeRelationship}/>
                </div> */}
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Receptividade Contrato</label>
                    <select className="form-select" name="receptividade_contrato" value={formDataRelationship.receptividade_contrato} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.receptividade_contrato ? '#fff' : '#999'}}>
                      <option value={0} style={{color: '#fff'}}>0</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>


                {/* <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Empresa</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="satisfacao_empresa" style={{height:'45px'}} value={formDataRelationship.satisfacao_empresa} onChange={handleInputChangeRelationship}/>
                </div> */}

                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Empresa</label>
                    <select className="form-select" name="satisfacao_empresa" value={formDataRelationship.satisfacao_empresa} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.satisfacao_empresa ? '#fff' : '#999'}}>
                      <option value={0} style={{color: '#fff'}}>0</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>

                {/* <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Clube</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="satisfacao_clube" style={{height:'45px'}} value={formDataRelationship.satisfacao_clube} onChange={handleInputChangeRelationship}/>
                </div> */}
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Clube</label>
                    <select className="form-select" name="satisfacao_clube" value={formDataRelationship.satisfacao_clube} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.satisfacao_clube ? '#fff' : '#999'}}>
                      <option value={0} style={{color: '#fff'}}>0</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>
              </div>
              <div className='col-md-6'>
                {/* <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Relação Familiares</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="relacao_familiares" style={{height:'45px'}} value={formDataRelationship.relacao_familiares} onChange={handleInputChangeRelationship}/>
                </div> */}
              <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Relação Familiares</label>
                    <select className="form-select" name="relacao_familiares" value={formDataRelationship.relacao_familiares} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.relacao_familiares ? '#fff' : '#999'}}>
                      <option value={0} style={{color: '#fff'}}>0</option>
                      <option value={1} style={{color: '#fff'}}>1</option>
                      <option value={2} style={{color: '#fff'}}>2</option>
                      <option value={3} style={{color: '#fff'}}>3</option>
                      <option value={4} style={{color: '#fff'}}>4</option>
                      <option value={5} style={{color: '#fff'}}>5</option>
                    </select>
                </div>
                {/* <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Influencia Externa</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="influencias_externas" style={{height:'45px'}} value={formDataRelationship.influencias_externas} onChange={handleInputChangeRelationship}/>
                </div> */}
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Influencia Externa</label>
                    <select className="form-select" name="influencias_externas" value={formDataRelationship.influencias_externas} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.influencias_externas ? '#fff' : '#999'}}>
                      <option value={0} style={{color: '#fff'}}>0</option>
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
                      <option value="" disabled hidden>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Pendência Clube</label>
                    <select className="form-select" name="pendencia_clube" value={formDataRelationship.pendencia_clube} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.pendencia_clube ? '#fff' : '#999'}}>
                      <option value="" disabled hidden>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                </div>
              </div>
          <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClickRelationShip}>Salvar</button>
          </div>
            </div>

        <ToastContainer />
        </Box>
      </Modal>
      {/* Controle de Suporte */}
      <Modal
        open={openCreateSupportControl}
        onClose={handleCloseCreateSupportControl}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Criar Controle de Suporte"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseCreateSupportControl}
/>
          </div>
          <hr />
          <div className="row" style={{height:'400px'}}>
              <div className=''>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_controle" style={{height:'45px'}} value={formDataSupportControl.data_controle} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome</label>
                      <input type="text" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="nome" style={{height:'45px'}} value={formDataSupportControl.nome} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Quantidade</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="quantidade" style={{height:'45px'}} value={formDataSupportControl.quantidade} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Preço</label>
                      <input type="number" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="preco" style={{height:'45px'}} value={formDataSupportControl.preco} onChange={handleInputChangeSupportControl}/>
                </div>
              </div>
            </div>

          <div className='ms-3 d-flex flex-column mt-5' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClickSupportControl}>Salvar</button>
          </div>
        <ToastContainer />
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
          <SideBar athleteData={athlete} modal={true}/>
        </Box>
      </Modal>
      <Modal
        open={openContractHistory}
        onClose={handleCloseContractHistory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <ContractHistory closeModal={handleCloseContractHistory} athleteId={athleteId}/>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  )
}
