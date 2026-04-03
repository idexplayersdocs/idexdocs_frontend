import axios from 'axios';
import { showErrorToast } from '@/lib/toast-error';

const apiURL = process.env.API_URL;

export const getAthletes = async (page:number, athlete: string | null = '') => {
  try {
    let tokenLocal: any = '';
    if (typeof window !== 'undefined') {
      tokenLocal = window.localStorage.getItem('token');
    }

    let url = `${apiURL}/atleta?per_page=10&page=${page}`;
    if (athlete !== '') {
      url += `&atleta=${athlete}`;
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${tokenLocal}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.log(error.response.status)
    showErrorToast(error.response.data.errors[0].message);
    throw error;
  }
};

export const getAthleteById = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/atleta/${athleteId}`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro na lista de atletas');
    }
  }
};

export const createAthlete = async (athleteData: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/atleta`, athleteData);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao criar atleta');
    throw error;
  }
};

export const uploadImageAthlete = async (IDAtleta: any, file:any) => {
  try {
    const response = await axios.post(`${apiURL}/file-upload/atleta/${IDAtleta}`, file);
    return response.data;
  } catch (error) {
    showErrorToast('Erro no anexo da imagem');
    throw error;
  }
};

export const getAvatarAthletes = async (athleteId: any) => {
  try {
    const response = await axios.get(`${apiURL}/avatar/atleta/${athleteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const editAthlete = async (athleteData: any, athleteId: any) => {
  try {
    const response = await axios.put(`${apiURL}/update/atleta/${athleteId}`, athleteData);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao editar o atleta');
    throw error;
  }
};
