import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const apiURL = process.env.API_URL;

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