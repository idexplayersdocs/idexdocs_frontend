import axios from 'axios';
import type { PaginatedResponse, Injury } from '@/types';

const apiURL = process.env.API_URL;

export const getInjuries = async (athleteId: number | string, page: number): Promise<PaginatedResponse<Injury> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/lesao/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createInjuries = async (request: Partial<Injury>) => {
  try {
    const response = await axios.post(`${apiURL}/create/lesao`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const updateInjuries = async (request: Partial<Injury>) => {
  try {
    const response = await axios.put(`${apiURL}/update/lesao`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
