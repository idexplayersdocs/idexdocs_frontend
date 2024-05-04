import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = 'https://idexdocs-api.azurewebsites.net'

export const getAthletes = async () => {
  try {
    const response = await axios.get(`${apiURL}/atleta`);
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

export const getAthleteRelationship = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/questionario/relacionamento/atleta/${athleteId}`);
      console.log(response)
      // toast.success('sucesso')
      return response;
    } catch (error) {
      toast.error('erro');
      console.error(`Error fetching user with ID ${athleteId}:`, error);
      throw error;
    }
  }
};

export const createAthlete = async (athleteData: any) => {
  console.log(athleteData)
  try {
    const response = await axios.post(`${apiURL}/create/atleta`, athleteData);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    console.log(response)
    return response.data;
  } catch (error) {
    toast.error('Erro ao criar atleta');
    console.error('Erro ao criar atleta:', error);
    throw error;
  }
};

