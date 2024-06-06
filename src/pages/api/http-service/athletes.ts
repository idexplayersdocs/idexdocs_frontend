import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

const apiURL = process.env.API_URL;

export const getAthletes = async (page:number, athlete: string | null = '') => {
  try {
    let url = `${apiURL}/atleta?per_page=10&page=${page}`
    if(athlete !== ''){
      url += `&atleta=${athlete}`
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAthleteById = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/atleta/${athleteId}`);
      // toast.success('sucesso')
      return response.data;
    } catch (error) {
      toast.error('Erro na lista de atletas', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
        });
    }
  }
};

export const createAthlete = async (athleteData: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/atleta`, athleteData);
    return response.data;
  } catch (error) {
    toast.error('Erro ao criar atleta', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
      });

    throw error;
  }
};

export const uploadImageAthlete = async (IDAtleta: any, file:any) => {
  try {
    const response = await axios.post(`${apiURL}/file-upload/atleta/${IDAtleta}`, file);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Erro no anexo da imagem', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
      });
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
    toast.error('Erro ao editar o atleta', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
      });

    throw error;
  }
};