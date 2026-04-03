import axios from 'axios';
import { showErrorToast } from '@/lib/toast-error';

const apiURL = process.env.API_URL;

export const getContract = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro ao abrir os contratos');
      throw error;
    }
  }
};

export const createContract = async (request: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/contrato`, request);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao criar o contrato');
    throw error;
  }
};

export const editContract = async (request: any) => {
  try {
    const response = await axios.put(`${apiURL}/update/contrato`, request);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao editar o Contrato');
    throw error;
  }
};

export const getContractVersion = async (athleteId: any, page:number) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/versao/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro ao abrir as versões do contrato');
      throw error;
    }
  }
};
