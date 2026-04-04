import axios from 'axios';
import type { PaginatedResponse, Competition } from '@/types';

const apiURL = process.env.API_URL;

export const getCompetitions = async (athleteId: number | string, page: number): Promise<PaginatedResponse<Competition> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/competicao/atleta/${athleteId}?page=${page}&per_page=${6}`);
      return response.data;
    } catch (error) {
      console.error(`Error:`, error);
      throw error;
    }
  }
};

export const createCompetitions = async (request: Partial<Competition>) => {
  try {
    const response = await axios.post(`${apiURL}/create/competicao`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const updateCompetitions = async (request: Partial<Competition>) => {
  try {
    const response = await axios.put(`${apiURL}/update/competicao`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
