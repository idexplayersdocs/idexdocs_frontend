import axios from 'axios';
import type { Observation, ObservationType } from '@/types';

const apiURL = process.env.API_URL;

export const getObservations = async (athleteId: number | string, type: ObservationType) => {
  try {
    const response = await axios.get(`${apiURL}/observacao/atleta/${athleteId}?tipo=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const saveObservations = async (request: Observation) => {
  try {
    const response = await axios.post(`${apiURL}/create/observacao`, request);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
