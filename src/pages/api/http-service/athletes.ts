import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { apiURL } from '../api';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = 'https://idexdocs-api.azurewebsites.net';

export const getAthletes = async (page:number) => {
  try {
    const response = await axios.get(`${apiURL}/atleta?per_page=10&page=${page}`);
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
      toast.error('erro');
      console.error(`Error fetching user with ID ${athleteId}:`, error);
      throw error;
    }
  }
};

export const createAthlete = async (athleteData: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/atleta`, athleteData);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Erro ao criar atleta');
    console.error('Erro ao criar atleta:', error);
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
    toast.error('Erro ao criar atleta');
    console.error('Erro ao criar atleta:', error);
    throw error;
  }
};