import { showErrorToast } from '@/lib/toast-error';
import type { PaginatedResponse, AthleteListItem, AthleteDetail, AthleteCreateRequest, AthleteCreateResponse, ApiResponse } from '@/types';
import { axiosClient } from '@/lib/axiosClient';

export const getAthletes = async (page: number, athlete: string | null = ''): Promise<PaginatedResponse<AthleteListItem>> => {
  try {
    let url = `/atleta?per_page=10&page=${page}`;
    if (athlete !== '') {
      url += `&atleta=${athlete}`;
    }

    const response = await axiosClient.get(url);

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { errors?: Array<{ message: string }> } } };
    console.log(err.response?.status);
    showErrorToast(err.response?.data?.errors?.[0]?.message || 'Erro na lista de atletas');
    throw error;
  }
};

export const getAthleteById = async (athleteId: number | string): Promise<ApiResponse<AthleteDetail> | undefined> => {
  if(athleteId){
    try {
      const response = await axiosClient.get(`/atleta/${athleteId}`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro na lista de atletas');
    }
  }
};

export const createAthlete = async (athleteData: AthleteCreateRequest): Promise<AthleteCreateResponse> => {
  try {
    const response = await axiosClient.post(`/create/atleta`, athleteData);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao criar atleta');
    throw error;
  }
};

export const uploadImageAthlete = async (IDAtleta: number | string, file: FormData): Promise<unknown> => {
  try {
    const response = await axiosClient.post(`/file-upload/atleta/${IDAtleta}`, file);
    return response.data;
  } catch (error) {
    showErrorToast('Erro no anexo da imagem');
    throw error;
  }
};

export const getAvatarAthletes = async (athleteId: number | string): Promise<unknown> => {
  try {
    const response = await axiosClient.get(`/avatar/atleta/${athleteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const editAthlete = async (athleteData: Partial<AthleteDetail>, athleteId: number | string): Promise<unknown> => {
  try {
    const response = await axiosClient.put(`/update/atleta/${athleteId}`, athleteData);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao editar o atleta');
    throw error;
  }
};
