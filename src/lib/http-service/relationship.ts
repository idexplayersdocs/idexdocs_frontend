import axios from 'axios';
import { showErrorToast } from '@/lib/toast-error';
import type { Relationship, SupportControl } from '@/types';

const apiURL = process.env.API_URL;

export const getAthleteRelationship = async (athleteId: number | string, page: number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/questionario/relacionamento/atleta/${athleteId}?page=${page}&per_page=${5}`);
      return response;
    } catch (error) {
      showErrorToast('erro');
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createAthleteRelationship = async (request: Relationship) => {
  try {
    const response = await axios.post(`${apiURL}/questionario/relacionamento/create`, request);
    return response.data;
  } catch (error) {
    console.error('Erro', error);
    throw error;
  }
};

export const getSupportControl = async (athleteId: number | string, page: number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/controle/atleta/${athleteId}?page=${page}&per_page=${3}`);
      return response;
    } catch (error) {
      showErrorToast('erro');
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createSupportControl = async (request: FormData | SupportControl) => {
  try {
    const response = await axios.post(`${apiURL}/create/controle`, request);
    return response.data;
  } catch (error) {
    console.error('Erro', error);
    throw error;
  }
};

export const deleteSupportControl = async (controle_id: number) => {
  try {
    const response = await axios.delete(`${apiURL}/delete/controle/${controle_id}`)
    return response.data
  } catch (error) {
    console.error('Erro', error);
    throw error
  }
}
