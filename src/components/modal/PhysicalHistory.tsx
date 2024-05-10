import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-lesoes.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { createPhysical, getPhysical } from '@/pages/api/http-service/physical';
import Loading from 'react-loading';
import { Bounce, ToastContainer, toast } from 'react-toastify';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
};

export default function PhysicalHistory({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [openRegisterPhysical, setOpenRegisterPhysical] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1)
  const [physical, setPhysical] = useState<any>({
    atleta_id: athleteId,
    estatura: '',
    envergadura: '',
    peso: '',
    percentual_gordura: '',
    data_criacao: '',
    data_atualizado: '',
  });

  const [formRegisterPhysical, setFormRegisterPhysical] = useState<any>({
    "caracteristica": "fisico",
    "atleta_id": 2,
    "estatura": 170,
    "envergadura": 183,
    "peso": 90,
    "percentual_gordura": 15.3
  });

  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        try {
          const physicalList = await getPhysical(athleteId);
          console.log(physicalList)
          setPhysical(physicalList?.data);
          setTotalRow(physicalList?.total);

        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchAthletesData();
    }
  }, [athleteId]);

  const handleOpenRegisterPhysical = () => setOpenRegisterPhysical(true);
  const handleCloseRegisterPhysical = () => {
    setOpenRegisterPhysical(false)
    setFormRegisterPhysical({
      atleta_id: athleteId,
      nome: '',
      data_inicio: '',
      data_fim: ''
    });
  }

  const handleInputChangeRegisterPhysical = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormRegisterPhysical((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaverRegisterPhysical = async () => {
    try {
      const response = await createPhysical(formRegisterPhysical);

      const handleCloseRegisterPhysical = () => {
        setOpenRegisterPhysical(false)
        setFormRegisterPhysical({
          atleta_id: athleteId,
          nome: '',
          data_inicio: '',
          data_fim: ''
        });
      }

      setPage(1)
      const clubList = await getPhysical(athleteId);
      console.log(clubList)
      setPhysical(clubList?.data);
      setTotalRow(clubList?.total);
    } catch (error:any) {
      toast.error(error.response.data.errors[0].message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }
  };

  const itemsPerPage = 6; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  const handleChangePage = (event: any, newPage:number) => {
    setPage(newPage);
  };

  return (
    <>
    <div className='d-flex justify-content-between'>
      <Subtitle subtitle='Estatura - Envergadura - Peso - % de Gordura'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3' onClick={handleOpenRegisterPhysical}>
      <AddButton />
    </div>
    <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Data Criacao</th>
              <th className="table-dark text-center" scope="col">Data Atualizado</th>
              <th className="table-dark text-center" scope="col">Estatura</th>
              <th className="table-dark text-center" scope="col">Envergadura</th>
              <th className="table-dark text-center" scope="col">Peso</th>
              <th className="table-dark text-center" scope="col">% Gordura</th>
            </tr>
          </thead>
          <tbody>
            {
              physical.length > 0 ? (
                Array.isArray(physical) && physical.map((caracteristica, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{caracteristica.data_criacao}</td>
                    <td className="table-dark text-center">{caracteristica.data_atualizado}</td>
                    <td className="table-dark text-center">{caracteristica.estatura}</td>
                    <td className="table-dark text-center">{caracteristica.envergadura}</td>
                    <td className="table-dark text-center">{caracteristica.peso}</td>
                    <td className="table-dark text-center">{caracteristica.percentual_gordura}</td>
                  </tr>
                ))
              ) : (
                // <tr>
                //   <td colSpan={5} className="table-dark text-center">Carregando...</td>
                <Loading type='cylon' color="#fff"/>

                // </tr>
              )
            }
          </tbody>
        </table>
        {
          totalRow > itemsPerPage &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(totalRow / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              size="large"
            />
        }
      </div>
      <Modal
        open={openRegisterPhysical}
        onClose={handleCloseRegisterPhysical}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Registrar Clube"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseRegisterPhysical}/>
          </div>
          <hr />
          <div className="row" style={{height:'350px'}}>
              <div className='col'>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Criação</label>
                      <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_criacao" style={{height:'45px'}} value={formRegisterPhysical.data_criacao} onChange={handleInputChangeRegisterPhysical}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Atualizada</label>
                      <input type="date" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="data_atualizado" style={{height:'45px'}} value={formRegisterPhysical.data_atualizado} onChange={handleInputChangeRegisterPhysical}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Estatura</label>
                      <input type="text" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="estatura" style={{height:'45px'}} value={formRegisterPhysical.estatura} onChange={handleInputChangeRegisterPhysical}/>
                </div>
              </div>
              <div className='col'>
              <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Envergadura</label>
                      <input type="text" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="envergadura" style={{height:'45px'}} value={formRegisterPhysical.envergadura} onChange={handleInputChangeRegisterPhysical}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Peso</label>
                      <input type="text" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="peso" style={{height:'45px'}} value={formRegisterPhysical.peso} onChange={handleInputChangeRegisterPhysical}/>
                </div>
                <div className="d-flex flex-column w-100 mt-3">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>% Gordura</label>
                      <input type="text" className="form-control input-create input-date bg-dark" placeholder="Digite..." name="percentual_gordura" style={{height:'45px'}} value={formRegisterPhysical.percentual_gordura} onChange={handleInputChangeRegisterPhysical}/>
                </div>
              </div>
            </div>
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaverRegisterPhysical}>Salvar</button>
          </div>
          <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
