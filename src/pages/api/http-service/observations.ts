import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = 'https://idexdocs-api.azurewebsites.net';

export const getObservations = async (athleteId: any) => {
  try {
    const response = await axios.get(`${apiURL}/observacao/atleta/${athleteId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createObservations = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/observacao`, request);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};