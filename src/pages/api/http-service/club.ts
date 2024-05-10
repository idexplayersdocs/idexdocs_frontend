import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = 'https://idexdocs-api.azurewebsites.net';

export const getClub = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/clube/atleta/${athleteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createClub = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/clube`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
