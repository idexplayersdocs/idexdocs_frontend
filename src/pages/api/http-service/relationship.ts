import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

const apiURL = 'https://idexdocs-api.azurewebsites.net';

export const getAthleteRelationship = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/questionario/relacionamento/atleta/${athleteId}?page=${page}&per_page=${7}`);
      return response;
    } catch (error) {
      toast.error('erro');
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createAthleteRelationship = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/questionario/relacionamento/create`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro', error);
    throw error;
  }
};

export const getSupportControl = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/controle/atleta/${athleteId}?page=${page}&per_page=${3}`);
      return response;
    } catch (error) {
      toast.error('erro');
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createSupportControl = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/controle`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro', error);
    throw error;
  }
};