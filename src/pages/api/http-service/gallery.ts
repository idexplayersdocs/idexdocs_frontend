import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiURL = process.env.API_URL;

export const getGalleryById = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/multiple-files-download/atleta/${athleteId}?page=1&per_page=999999999999`);
      // toast.success('sucesso')
      return response.data;
    } catch (error) {
      toast.error('Erro na lista de fotos', {
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
export const getVideosById = async (athleteId: any) => {
  if(athleteId){
    try {
      const response = await axios.get(`${apiURL}/video-list/atleta/${athleteId}?page=1&per_page=999999999999`);
      // toast.success('sucesso')
      return response.data;
    } catch (error) {
      toast.error('Erro na lista dos vídeos', {
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

export const saveImage = async (files: any, athleteId: any) => {
  try {
    const response = await axios.post(`${apiURL}/multiple-files-upload/atleta/${athleteId}`, files);
    return response.data;
  } catch (error) {
    toast.error('Erro ao salvar a(s) imagem(s)', {
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

export const fetchLinkbyAthleteId = async (athleteId: any) => {
  try {
    const response = await axios.get(`${apiURL}/link/atleta/${athleteId}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar links', {
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
}


export const saveLink = async (link: any) => {
  try {
    const response = await axios.post(`${apiURL}/create/link`, link)
    return response.data
  } catch (error) {
    toast.error('Erro ao salvar link', {
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
}


export const deleteLink = async (linkId: string) => {
  try {
    const response = await axios.delete(`${apiURL}/delete/link/${linkId}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao deletar link', {
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
}

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

export const editVideo = async (video: {id: number, descricao: string}) => {
  const request = {
    video_id: video.id,
    descricao: video.descricao
  }
  try {
    const response = await axios.put(`${apiURL}/video/update`, request);
    return response.data;
  } catch (error) {
    toast.error('Erro ao editar o Vídeo', {
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

export const editImage = async (image: {imagem_id: number, descricao: string}) => {
  const request = {
    imagem_id: image.imagem_id,
    descricao: image.descricao
  }
  try {
    const response = await axios.put(`${apiURL}/imagem/update`, request);
    return response.data;
  } catch (error) {
    toast.error('Erro ao editar o Imagem', {
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

export const deleteImage = async (IdImage: any) => {
  try {
    const response = await axios.delete(`${apiURL}/imagem/delete/${IdImage}`);
    return response.data;
  } catch (error) {
    toast.error('Erro ao deletar a imagem', {
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

export const deleteVideo = async (IdImage: any) => {
  try {
    const response = await axios.delete(`${apiURL}/video/delete/${IdImage}`);
    return response.data;
  } catch (error) {
    toast.error('Erro ao deletar o video', {
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

export const uploadVideoYoutube = async (IDAtleta: any, link:any) => {
  const request = {
    video_url: link.video_url
  }

  try {
    const response = await axios.post(`${apiURL}/video-upload/atleta/${IDAtleta}`, request);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Erro no anexo do link do youtube', {
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

export const uploadVideo = async (IDAtleta: any, file:any) => {

  try {
    const response = await axios.post(`${apiURL}/video-upload/atleta/${IDAtleta}`, file);
    // Se você quiser acessar os dados retornados pelo servidor, pode usar response.data
    // Por exemplo, console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Erro no anexo do vídeo', {
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

// export const editAthlete = async (athleteData: any, athleteId: any) => {
//   try {
//     const response = await axios.put(`${apiURL}/update/atleta/${athleteId}`, athleteData);
//     return response.data;
//   } catch (error) {
//     toast.error('Erro ao editar o atleta', {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       draggable: true,
//       progress: undefined,
//       theme: 'colored',
//       transition: Bounce,
//       });

//     throw error;
//   }
// };