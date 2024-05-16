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
import moment from 'moment';

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
  borderRadius: '20px',
};

export default function PerformanceCreation({closeModal, athleteData, dataList, labelList, athleteId}: any) {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(false);
  const [formDataList, setFormDataList] = useState(dataList)
  const [formDate, setFormDate] = useState<any>('')

  const handleCloseModal = () => {
    closeModal();
  };

  //--Label--//
  // Fisico
  const reorderedKeysLabelFisico = labelList.fisico.filter((item:any) => item !== "Total" && item !== "Média" && item !== "Data");
  const reorderedKeysLabelTecnico = labelList.tecnico.filter((item:any) => item !== "Total" && item !== "Média" && item !== "Data");
  const reorderedKeysLabelPsicologico = labelList.psicologico.filter((item:any) => item !== "Total" && item !== "Média" && item !== "Data");

  //--Dados--//
  // Fisico
  const dataFisico = dataList.fisico.map((item: any) => {
    const newItem = { ...item }; 
    for (const key in newItem) {
        if (newItem.hasOwnProperty(key)) {
            newItem[key] = ''; 
        }
    }
    return newItem; 
  });

  const reorderedKeysDataFisico: { [key: string]: any } = {
    // ['data_avaliacao']: dataFisico[0]['data_avaliacao'],
    ...Object.entries(dataFisico[0])
        .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  };
  const [formDataListFisico, setFormDataListFisico] = useState(reorderedKeysDataFisico);

  const handleChangeFisico = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormDataListFisico((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Tecnico
  const dataTecnico = dataList.tecnico.map((item: any) => {
    const newItem = { ...item }; 
    for (const key in newItem) {
        if (newItem.hasOwnProperty(key)) {
            newItem[key] = ''; 
        }
    }
    return newItem; 
  });

  const reorderedKeysDataTecnico: { [key: string]: any } = {
    // ['data_avaliacao']: dataTecnico[0]['data_avaliacao'],
    ...Object.entries(dataTecnico[0])
        .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  };
  const [formDataListTecnico, setFormDataListTecnico] = useState(reorderedKeysDataTecnico)

    const handleChangeTecnico = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormDataListTecnico((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    };

    // Psicologico
    const dataPsicologico = dataList.psicologico.map((item: any) => {
      const newItem = { ...item }; 
      for (const key in newItem) {
          if (newItem.hasOwnProperty(key)) {
              newItem[key] = ''; 
          }
      }
      return newItem; 
    });
  
    const reorderedKeysDataPsicologico: { [key: string]: any } = {
      // ['data_avaliacao']: dataPsicologico[0]['data_avaliacao'],
      ...Object.entries(dataPsicologico[0])
          .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    };
    const [formDataListPsicologico, setFormDataListPsicologico] = useState(reorderedKeysDataPsicologico)
  
      const handleChangePsicologico = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormDataListPsicologico((prevState: any) => ({
          ...prevState,
          [name]: value,
        }));
      };

    const handleInputDate = (event: any) => {
      setFormDate(event.target.value)
    };

  const handleSaverRegister = async () => {
    setLoading(true);
    try {
      
      const request = {
        ...formDataListFisico,
        ...formDataListTecnico,
        ...formDataListPsicologico,
        data_avaliacao: formDate,
        caracteristica: athleteData.posicao_primaria,
        atleta_id: athleteId
      };
      const response = await createPhysical(request);

      if(response){

        // Fisico
        const dataFisico = dataList.fisico.map((item: any) => {
          const newItem = { ...item }; 
          for (const key in newItem) {
              if (newItem.hasOwnProperty(key)) {
                  newItem[key] = ''; 
              }
          }
          return newItem; 
        });
  
        const reorderedKeysDataFisico: { [key: string]: any } = {
          ...Object.entries(dataFisico[0])
              .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        };
        setFormDataListFisico(reorderedKeysDataFisico);
  
        // Tecnico
        const dataTecnico = dataList.tecnico.map((item: any) => {
          const newItem = { ...item }; 
          for (const key in newItem) {
              if (newItem.hasOwnProperty(key)) {
                  newItem[key] = ''; 
              }
          }
          return newItem; 
        });
  
        const reorderedKeysDataTecnico: { [key: string]: any } = {
          ...Object.entries(dataTecnico[0])
              .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        };
        setFormDataListTecnico(reorderedKeysDataTecnico);
  
        // Psicologico
        const dataPsicologico = dataList.psicologico.map((item: any) => {
          const newItem = { ...item }; 
          for (const key in newItem) {
              if (newItem.hasOwnProperty(key)) {
                  newItem[key] = ''; 
              }
          }
          return newItem; 
        });
      
        const reorderedKeysDataPsicologico: { [key: string]: any } = {
          ...Object.entries(dataPsicologico[0])
              .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        };
        setFormDataListPsicologico(reorderedKeysDataPsicologico);
  
  
        handleCloseModal();
      }

    } catch (error:any) {
      toast.error(error.response.data.errors[0].message, {
        position: "bottom-center",
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
        <Subtitle subtitle='Criar Caracteristicas'/>
        <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
      </div>
      <hr />
      <div className="d-flex flex-column w-25 mt-3 mb-5">
        <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data</label>
        <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="Digite..." name="formDate" style={{height:'45px'}} value={formDate} onChange={handleInputDate}/>
      </div>
      <div className='row' style={{maxHeight: '500px', overflow: 'auto'}}>
      <div className='col' style={{borderRight: '1px solid white'}}>
        <h3>PERFIL FÍSICO E TÉCNICO</h3>
        {reorderedKeysLabelFisico.map((label: any, index: number) => (
          <div key={index} className="d-flex flex-column w-100 mt-3">
            <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>{label}</label>
            <input 
              type="number" 
              className="form-control input-create input-date bg-dark-custom " 
              placeholder={label} 
              name={Object.keys(formDataListFisico)[index]}
              style={{height:'45px'}} 
              value={formDataListFisico[formDataListFisico[index]]}
              onChange={handleChangeFisico}
            />
          </div>
        ))}
      </div>
      <div className='col' style={{borderRight: '1px solid white'}}>
        <h3>PERFIL TÉCNICO DIFERENCIAL</h3>
        {reorderedKeysLabelTecnico.map((label: any, index: number) => (
          <div key={index} className="d-flex flex-column w-100 mt-3">
            <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>{label}</label>
            <input 
              type="number"  
              className="form-control input-create input-date bg-dark-custom " 
              placeholder={label} 
              name={Object.keys(formDataListTecnico)[index]}
              style={{height:'45px'}} 
              value={formDataListTecnico[formDataListTecnico[index]]}
              onChange={handleChangeTecnico}
            />
          </div>
        ))}
      </div>
      <div className='col' style={{borderRight: '1px solid white'}}>
        <h3>PERFIL PSICOLÓGICO</h3>
        {reorderedKeysLabelPsicologico.map((label: any, index: number) => (
          <div key={index} className="d-flex flex-column w-100 mt-3">
            <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>{label}</label>
            <input 
              type="number"
              className="form-control input-create input-date bg-dark-custom " 
              placeholder={label} 
              name={Object.keys(formDataListPsicologico)[index]}
              style={{height:'45px'}} 
              value={formDataListPsicologico[formDataListPsicologico[index]]}
              onChange={handleChangePsicologico}
            />
          </div>
        ))}
      </div>
      <div className='ms-3 d-flex flex-column mt-3' style={{width: '98%'}}>
        <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSaverRegister}>Salvar</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
