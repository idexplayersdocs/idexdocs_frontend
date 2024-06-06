import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

const apiURL = process.env.API_URL || 'https://idexdocs-api.azurewebsites.net';

export const getCompetitions = async (athleteId: any, page: number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/competicao/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createCompetitions = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/competicao`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
