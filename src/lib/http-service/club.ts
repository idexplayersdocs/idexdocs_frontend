import axios from 'axios';
import type { PaginatedResponse, Club } from '@/types';

const apiURL = process.env.API_URL;

export const getClub = async (athleteId: number | string, page: number): Promise<PaginatedResponse<Club> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/clube/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createClub = async (request: Partial<Club>) => {
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

export const updateClub = async (request: Partial<Club>) => {
  try {
    const response = await axios.put(`${apiURL}/update/clube`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
