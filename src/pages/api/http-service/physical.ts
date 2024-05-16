import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = 'https://idexdocs-api.azurewebsites.net';

export const getPhysical = async (athleteId: any, page: number, model: string, Perpage: any = 10000) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/caracteristica/atleta/${athleteId}/?page=${page}&per_page=${Perpage}&model=${model}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createPhysical = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/caracteristica`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
