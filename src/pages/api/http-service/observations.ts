import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

const apiURL = process.env.API_URL || 'https://idexdocs-api.azurewebsites.net';

export const getObservations = async (athleteId: any, type:string) => {
  try {
    const response = await axios.get(`${apiURL}/observacao/atleta/${athleteId}?tipo=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const saveObservations = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/observacao`, request);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};