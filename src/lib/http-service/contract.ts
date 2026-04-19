import axios from 'axios';
import type { PaginatedResponse, Contract, ContractVersion } from '@/types';

const apiURL = process.env.API_URL;

export const getContract = async (athleteId: number | string, page: number): Promise<PaginatedResponse<Contract> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const createContract = async (request: FormData | Partial<Contract>) => {
  try {
    const response = await axios.post(`${apiURL}/create/contrato`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editContract = async (request: FormData | Partial<Contract>) => {
  try {
    const response = await axios.put(`${apiURL}/update/contrato`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractVersion = async (athleteId: number | string, page: number): Promise<PaginatedResponse<ContractVersion> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/contrato/versao/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const createContractVersion = async (request: FormData | Partial<ContractVersion>) => {
  try {
    const response = await axios.post(`${apiURL}/create/contrato/versao`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editContractVersion = async (request: FormData | Partial<ContractVersion>) => {
  try {
    const response = await axios.put(`${apiURL}/update/contrato/versao`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};
