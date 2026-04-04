import axios from 'axios';
import { showErrorToast } from '@/lib/toast-error';
import type { PaginatedResponse, GalleryImage, GalleryVideo, AthleteLink } from '@/types';

const apiURL = process.env.API_URL;

export const getGalleryById = async (athleteId: number | string): Promise<PaginatedResponse<GalleryImage> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/multiple-files-download/atleta/${athleteId}?page=1&per_page=999999999999`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro na lista de fotos');
    }
  }
};
export const getVideosById = async (athleteId: number | string): Promise<PaginatedResponse<GalleryVideo> | undefined> => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/video-list/atleta/${athleteId}?page=1&per_page=999999999999`);
      return response.data;
    } catch (error) {
      showErrorToast('Erro na lista dos vídeos');
    }
  }
};

export const saveImage = async (files: FormData, athleteId: number | string) => {
  try {
    const response = await axios.post(`${apiURL}/multiple-files-upload/atleta/${athleteId}`, files);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao salvar a(s) imagem(s)');
    throw error;
  }
};

export const fetchLinkbyAthleteId = async (athleteId: number | string): Promise<{ data: AthleteLink[] }> => {
  try {
    const response = await axios.get(`${apiURL}/link/atleta/${athleteId}`)
    return response.data
  } catch (error) {
    showErrorToast('Erro ao buscar links');
    throw error;
  }
}


export const saveLink = async (link: { atleta_id: number | string; url: string; descricao?: string }) => {
  try {
    const response = await axios.post(`${apiURL}/create/link`, link)
    return response.data
  } catch (error) {
    showErrorToast('Erro ao salvar link');
    throw error;
  }
}


export const deleteLink = async (linkId: string) => {
  try {
    const response = await axios.delete(`${apiURL}/delete/link/${linkId}`)
    return response.data
  } catch (error) {
    showErrorToast('Erro ao deletar link');
    throw error;
  }
}

export const uploadImageAthlete = async (IDAtleta: number | string, file: FormData) => {
  try {
    const response = await axios.post(`${apiURL}/file-upload/atleta/${IDAtleta}`, file);
    return response.data;
  } catch (error) {
    showErrorToast('Erro no anexo da imagem');
    throw error;
  }
};

export const getAvatarAthletes = async (athleteId: number | string) => {
  try {
    const response = await axios.get(`${apiURL}/avatar/atleta/${athleteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const editVideo = async (video: {id: number, descricao: string}) => {
  const request = {
    video_id: video.id,
    descricao: video.descricao
  }
  try {
    const response = await axios.put(`${apiURL}/video/update`, request);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao editar o Vídeo');
    throw error;
  }
};

export const editImage = async (image: {imagem_id: number, descricao: string}) => {
  const request = {
    imagem_id: image.imagem_id,
    descricao: image.descricao
  }
  try {
    const response = await axios.put(`${apiURL}/imagem/update`, request);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao editar o Imagem');
    throw error;
  }
};

export const deleteImage = async (IdImage: number | string) => {
  try {
    const response = await axios.delete(`${apiURL}/imagem/delete/${IdImage}`);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao deletar a imagem');
    throw error;
  }
};

export const deleteVideo = async (IdVideo: number | string) => {
  try {
    const response = await axios.delete(`${apiURL}/video/delete/${IdVideo}`);
    return response.data;
  } catch (error) {
    showErrorToast('Erro ao deletar o video');
    throw error;
  }
};

export const uploadVideoYoutube = async (IDAtleta: number | string, link: { video_url: string }) => {
  const request = {
    video_url: link.video_url
  }

  try {
    const response = await axios.post(`${apiURL}/video-upload/atleta/${IDAtleta}`, request);
    return response.data;
  } catch (error) {
    showErrorToast('Erro no anexo do link do youtube');
    throw error;
  }
};

export const uploadVideo = async (IDAtleta: number | string, file: FormData) => {

  try {
    const response = await axios.post(`${apiURL}/video-upload/atleta/${IDAtleta}`, file);
    return response.data;
  } catch (error) {
    showErrorToast('Erro no anexo do vídeo');
    throw error;
  }
};
