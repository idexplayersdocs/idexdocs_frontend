
import React, { useEffect, useRef, useState } from 'react';
import dataRalationship from '../pages/api/mock-data/mock-data-relationship-list.json'
import dataSupportControl from '../pages/api/mock-data/mock-data-support-control.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Box, Modal, Pagination } from '@mui/material';
import Subtitle from './Subtitle';
import Observacoes from './Observation';
import AddButton from './AddButton';
import { useRouter } from 'next/router';
import { createAthleteRelationship, createSupportControl, getAthleteRelationship, getSupportControl } from '@/pages/api/http-service/relationship';
import Header from './Header';
import SideBar from './SideBar';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
};

type Props = {
  athlete: any
}
export default function Relationship() {
  const effectRan = useRef(false);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;

  const [pageRalationship, setPageRalationship] = useState(1);
  const [pageSupportControl, setPageSupportControl] = useState(1);
  const [displayedDataRelationShip, setDisplayedDataRelationShip] = useState<any>([]);
  const [displayedDataSupportControl, setDisplayedDataSupportControl] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreateQuestionaryRelationship, setOpenCreateQuestionaryRelationship] = useState(false);
  const [openCreateSupportControl, setOpenCreateSupportControl] = useState(false);
  const [totalRowRelationship, setTotalRowRelationship] = useState<number>(1);
  const [totalRowSupportControl, setTotalRowSupportControl] = useState<number>(1);

  const [observacao, setObservacao] = useState<any>({
    atleta_id: athleteId,
    tipo: 'relacionamento',
    descricao: ''
  });


  const [formDataRelationship, setFormDataRelationship] = useState<any>({
    atleta_id: athleteId,
    receptividade_contrato: '',
    satisfacao_empresa: '',
    satisfacao_clube: '',
    relacao_familiares: '',
    influencias_externas: '',
    pendencia_empresa: '',
    pendencia_clube: '',
    data_criacao: ''
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
        try {
          // Relacionamento
          const relationship = await getAthleteRelationship(athleteId, pageRalationship);
          setDisplayedDataRelationShip(relationship?.data.data);
          setTotalRowRelationship(relationship?.data.total);

          // Controle de Suporte
          const supportContorl = await getSupportControl(athleteId, pageSupportControl);
          setDisplayedDataSupportControl(supportContorl?.data.data);
          setTotalRowSupportControl(supportContorl?.data.total);

          // Observações
          // const responseObservacoes = await getObservations(athleteId);
          // console.log(responseObservacoes)
          // setObservacao(responseObservacoes?.data.data);

        } catch (error) {
          console.error('Error fetching athletes:', error);
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
      data_criacao: ''
    });
  }

  const handleSalvarClickRelationShip = async () => {
    try {
      formDataRelationship['pendencia_empresa'] = formDataRelationship['pendencia_empresa'] == 'true' ? true : false
      formDataRelationship['pendencia_clube'] = formDataRelationship['pendencia_empresa'] == 'true' ? true : false
      const response = await createAthleteRelationship(formDataRelationship);
    } catch (error) {
      console.error('Error:', error);
    } finally {
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
        data_criacao: ''
      });
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
      (formDataRelationship?.data_criacao ?? '').trim() !== ''
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
    try {
      formDataSupportControl['preco'] = parseFloat(formDataSupportControl.preco).toFixed(2)
      formDataSupportControl['athleteId'] = athleteId
      const response = await createSupportControl(formDataSupportControl);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleCloseCreateSupportControl();
      setFormDataSupportControl({
        atleta_id: athleteId,
        nome: '',
        quantidade: '',
        preco: '',
        data_controle: '',
      });
    }
    setPageSupportControl(1)
    await getSupportControl(athleteId, pageSupportControl);
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

  return (
    <>
      <Header />
      <div className="row justify-content-start">
        <div className="col-2">
          <SideBar athleteData={athleteId} />
        </div>
        <div className="col-10">
          <ul className="nav nav-tabs">
            <li className="nav-item me-1">
              <a className="nav-link active" aria-current="page" href={`/secure/athletes/${athleteId}/athleteRelationship`}>Relacionamento</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href={`/secure/athletes/${athleteId}/athletePerformance`}>Desempenho</a>
            </li>
          </ul>
          <div className="card athlete-detail-card" style={{ backgroundColor: 'var(--bg-secondary-color)', marginRight: '10px' }}>
            <div className='d-flex justify-content-end mt-3' style={{ marginRight: '30px' }}>
              <div onClick={handleOpenCreateQuestionaryRelationship}>
                <AddButton />
              </div>
              <div>
              </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center mb-3 m-3 force-scrool">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">DATA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">RECEPTIVIDADE CONTATO</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">SATISFAÇÃO EMPRESA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">SATISFAÇÃO CLUBE</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">RELAÇÕES FAMILIARES</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">INFLUÊNCIA EXTERNAS</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">PENDÊNCIAS EMPRESA</th>
                    <th className="table-dark text-center" style={{ fontSize: '13px' }} scope="col">PENDÊNCIAS CLUBE</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      Array.isArray(displayedDataRelationShip) && displayedDataRelationShip.map((relationship: any, index: number) => (
                        <tr key={index}>
                        <td className="table-dark text-center">{new Date(relationship.data_criacao).toLocaleDateString()}</td>
                        <td className="table-dark text-center">{relationship.receptividade_contrato}</td>
                        <td className="table-dark text-center">{relationship.satisfacao_empresa}</td>
                        <td className="table-dark text-center">{relationship.satisfacao_clube}</td>
                        <td className="table-dark text-center">{relationship.relacao_familiares}</td>
                        <td className="table-dark text-center">{relationship.influencias_externas}</td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon icon={relationship.pendencia_empresa ? faCheck : faXmark} size='xl' style={relationship.pendencia_empresa ? { color: "#15ff00" } : { color: "#ff0000" }} />
                        </td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon icon={relationship.pendencia_clube ? faCheck : faXmark} size='xl' style={relationship.pendencia_clube ? { color: "#15ff00" } : { color: "#ff0000" }} />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {
                totalRowRelationship > 7 &&
                <Pagination
                  className="pagination-bar"
                  count={Math.ceil(totalRowRelationship / 7)}
                  page={pageRalationship}
                  onChange={handleChangePageRalationship}
                  variant="outlined"
                  size="large"
                />
              }
            </div>
            <hr />
            <div className='row mt-3'>
              <div className="col-md d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool">
                <div className='d-flex justify-content-between align-items-center w-100 p-2'>
                  <div>
                    <Subtitle subtitle='Controle de Suporte' />
                  </div>
                  <div onClick={handleOpenCreateSupportControl}>
                    <AddButton />
                  </div>
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="table-dark text-center" scope="col">DATA</th>
                      <th className="table-dark text-center" scope="col">NOME</th>
                      <th className="table-dark text-center" scope="col">QUANTIDADE</th>
                      <th className="table-dark text-center" scope="col">PREÇO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Array.isArray(displayedDataSupportControl) && displayedDataSupportControl.map((supportContol,index) => (
                        <tr key={index}>
                          <td className="table-dark text-center">{new Date(supportContol.data_controle).toLocaleDateString()}</td>
                          <td className="table-dark text-center">{supportContol.nome}</td>
                          <td className="table-dark text-center">{supportContol.quantidade}</td>
                          <td className="table-dark text-center">{supportContol.preco}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                {
                  totalRowSupportControl > 3 &&
                  <Pagination
                    className="pagination-bar"
                    count={Math.ceil(totalRowSupportControl / 3)}
                    page={pageSupportControl}
                    onChange={handleChangePageSupportControl}
                    variant="outlined"
                    size="large"
                  />
                }
              </div>
              <div className='col-md'>
                <div className='ms-3 me-3 d-flex flex-column'>
                  <Observacoes />
                  <button type="button" className="btn btn-success align-self-end" style={{ width: '170px' }}>Salvar Observações</button>
                </div>
              </div>
            </div>
            {/* <Relationship athlete={athlete} /> */}
          </div>
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
              <div className='col'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data</label>
                      <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_criacao" style={{height:'45px'}} value={formDataRelationship.data_criacao} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Receptividade Contato</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="receptividade_contrato" style={{height:'45px'}} value={formDataRelationship.receptividade_contrato} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Empresa</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="satisfacao_empresa" style={{height:'45px'}} value={formDataRelationship.satisfacao_empresa} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Satisfação Clube</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="satisfacao_clube" style={{height:'45px'}} value={formDataRelationship.satisfacao_clube} onChange={handleInputChangeRelationship}/>
                </div>
              </div>
              <div className='col'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Relação Familiares</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="relacao_familiares" style={{height:'45px'}} value={formDataRelationship.relacao_familiares} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Influencia Externa</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="influencias_externas" style={{height:'45px'}} value={formDataRelationship.influencias_externas} onChange={handleInputChangeRelationship}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  {/* <div className="d-flex align-items-center"> */}
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Pendência Empresa</label>
                      {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                    <select className="form-select" name="pendencia_empresa" value={formDataRelationship.pendencia_empresa} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.pendencia_empresa ? '#fff' : '#999'}}>
                      <option value="" disabled hidden>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                  {/* </div> */}
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  {/* <div className="d-flex align-items-center"> */}
                    <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Pendência Clube</label>
                      {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                    <select className="form-select" name="pendencia_clube" value={formDataRelationship.pendencia_clube} onChange={handleInputChangeRelationship} style={{height:'45px', color: formDataRelationship.pendencia_clube ? '#fff' : '#999'}}>
                      <option value="" disabled hidden>Selecione</option>
                      <option value="true" style={{color: '#fff'}}>Sim</option>
                      <option value="false" style={{color: '#fff'}}>Não</option>
                    </select>
                  {/* </div> */}
                </div>
              </div>
            </div>

          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClickRelationShip} disabled={!isFormValidRelationship()}>Salvar</button>
          </div>
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
                      <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_controle" style={{height:'45px'}} value={formDataSupportControl.data_controle} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Nome</label>
                      <input type="text" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="nome" style={{height:'45px'}} value={formDataSupportControl.nome} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Quantidade</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="quantidade" style={{height:'45px'}} value={formDataSupportControl.quantidade} onChange={handleInputChangeSupportControl}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Preço</label>
                      <input type="number" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="preco" style={{height:'45px'}} value={formDataSupportControl.preco} onChange={handleInputChangeSupportControl}/>
                </div>
              </div>
            </div>

          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClickSupportControl}>Salvar</button>
          </div>
        </Box>
      </Modal>
    </>
  )
}
