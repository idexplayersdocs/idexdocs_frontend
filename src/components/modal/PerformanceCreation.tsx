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
};

export default function PerformanceCreation({closeModal, athleteId, dataList, labelList}: any) {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(false);
  const [formDataList, setFormDataList] = useState(dataList)

  const handleCloseModal = () => {
    closeModal();
  };
  // console.log(labelList)
  // console.log(dataList)


  //--Label--//
  // Fisico
const reorderedKeysLabelFisico = labelList.fisico.filter((item:any) => item !== "Total" && item !== "Media");

console.log(reorderedKeysLabelFisico);



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
  ['data_avaliacao']: dataFisico[0]['data_avaliacao'],
  ...Object.entries(dataFisico[0])
      .filter(([key]) => key !== 'sum' && key !== 'mean' && key !== 'data_avaliacao')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
};
const [formDataListFisico, setFormDataListFisico] = useState(reorderedKeysDataFisico)

  console.log(formDataListFisico['controle_bola_fis'])
  // useEffect(() => {
  //   if (!effectRan.current) {
  //     setFormDataList(dataList);
  //     effectRan.current = true;
  //   }
  // }, [dataList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
  
    // const newData = { ...dataList };
    // newData.fisico[index][name] = value;
    // setFormDataList(newData);
    console.log(formDataListFisico)
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
  <div className='row' style={{maxHeight: '500px', overflow: 'auto'}}>
    <div className='col' style={{borderRight: '1px solid white'}}>
      <h3>PERFIL FÍSICO E TÉCNICO</h3>
      {reorderedKeysLabelFisico.map((label: any, index: number) => (
        <div key={index} className="d-flex flex-column w-100 mt-3">
          <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>{label}</label>
          <input 
            type="number" 
            className="form-control input-create input-date bg-dark" 
            placeholder={label} 
            name={label} 
            style={{height:'45px'}} 
            value={formDataListFisico[formDataListFisico[label]]} // Usando o labelMapping para acessar o valor correto em formDataListFisico
            onChange={(e) => handleChange(e, index)} 
          />
        </div>
      ))}
    </div>
  </div>
  <ToastContainer />
    </>
  );
  
}
