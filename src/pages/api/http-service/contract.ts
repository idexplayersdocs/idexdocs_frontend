import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiURL = process.env.API_URL;

export const getContract = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      toast.error('Erro ao abrir os contratos', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
        });
      throw error;
    }
  }
};

export const createContract = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/contrato`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Erro ao criar o contrato', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
      });
    throw error;
  }
};

export const editContract = async (request: any) => {
  try {
    const response = await axios.put(`${apiURL}/update/contrato`, request);
    return response.data;
  } catch (error) {
    toast.error('Erro ao editar o Contrato', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
      });

    throw error;
  }
};

export const getContractVersion = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/versao/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      toast.error('Erro ao abrir as versões do contrato', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
        });
      throw error;
    }
  }
};
