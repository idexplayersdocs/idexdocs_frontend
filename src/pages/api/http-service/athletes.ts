import axios from 'axios';
import { useRouter } from 'next/router';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const apiURL = process.env.NEXT_PUBLIC_API_URL;
// const apiURL = 'https://idexdocs-api.azurewebsites.net';

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
    toast.error(error.response.data.errors[0].message, {
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