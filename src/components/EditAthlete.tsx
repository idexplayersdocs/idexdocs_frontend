import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Subtitle from "./Subtitle";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Image from "next/image";
import { Box, Button, Modal, colors, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createAthlete, editAthlete, uploadImageAthlete } from "@/pages/api/http-service/athletes";
import { useRouter } from "next/router";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditAthlete({athleteData}: any) {
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  const [formAvatar, setFormAvatar] = useState(athleteData.blob_url ? athleteData.blob_url : "/images/image-user.png");
  const [openEditAthlete, setOpenEditAthlete] = useState(false);
  const [formImage, setFormImage]:any = useState();
  const handleOpenEditAthlete = () => setOpenEditAthlete(true);
  const handleCloseCreateAthlete = () => {setOpenEditAthlete(false)}
  const [formData, setFormData] = useState({
    nome: athleteData.nome ? athleteData.nome : '',
    data_nascimento: athleteData.data_nascimento ? athleteData.data_nascimento : '',
    posicao_primaria: athleteData.posicao_primaria ? athleteData.posicao_primaria  : '',
    posicao_secundaria: athleteData.posicao_secundaria ? athleteData.posicao_secundaria : '' ,
    posicao_terciaria: athleteData.posicao_terciaria ? athleteData.posicao_terciaria : '',
    ativo: athleteData.ativo ? athleteData.ativo : '',
  });
  console.log(athleteData)

  const getImageFileObject = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader:any = new FileReader();
      reader.onload = () => {
        setFormAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setFormImage(file)
    } else {
      setFormAvatar("/images/image-user.png");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'ativo' ? value === 'true' : value
    }));
  };

  const handleSalvarClick = async () => {
    try {
      const newAthletesData = await editAthlete(formData, athleteId);
      if(newAthletesData){

        if(formImage){
          const formData = new FormData();
          formData.append('image', formImage);
          const uploadImage = await uploadImageAthlete(newAthletesData.id, formData);
          handleCloseCreateAthlete();
        }
      }
    } catch (error: any) {
      console.log(error)
    }
  }


  return (
    <>
      <div className="row" style={{height:'520px'}}>
        <div className="col-md-6">
            <div className="d-flex justify-content-start align-items-center mb-3">
            <Image 
              className="rounded mt-3 me-3"
              src={formAvatar}
              width={110}
              height={120}
              alt="Athlete logo"
              layout=""
              objectFit="cover"
            />
            <Button
              className="btn-success h-25"
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={getImageFileObject}/>
            </Button>
          </div>
          <div className="input w-100">
            <div className="d-flex align-items-center">
            <label className="ms-3" style={{color: 'white', fontSize: '20px', marginTop:'14px'}}>Nome</label>
            {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
            </div>
            <input type="text" className="form-control input-create bg-dark-custom " placeholder="Digite o nome do atleta" name="nome" value={formData.nome} onChange={handleInputChange} style={{height:'45px'}}/>
          </div>
          <div className="input w-100 mt-2">
          <div className="d-flex align-items-center">
            <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data de Nascimento</label>
              {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
            </div>
            <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_nascimento" value={formData.data_nascimento} onChange={handleInputChange} style={{height:'45px'}}/>
          </div>
          <div className="input w-100 mt-2">
            <div className="d-flex align-items-center">
              <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Posição Principal</label>
              </div>
              <select className="form-select" name="posicao_primaria" value={formData.posicao_primaria} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_primaria ? '#fff' : '#999'}}>
                <option value="" disabled hidden>Selecione</option>
                <option value="atacante" style={{color: '#fff'}}>Atacante</option>
                <option value="goleiro" style={{color: '#fff'}}>Goleiro</option>
                <option value="lateral" style={{color: '#fff'}}>Lateral</option>
                <option value="meia" style={{color: '#fff'}}>Meia</option>
                <option value="volante" style={{color: '#fff'}}>Volante</option>
                <option value="zagueiro" style={{color: '#fff'}}>Zagueiro</option>
              </select>
            </div>
        </div>
        <div className="col-md-6">
        <div>
          <div className="d-flex align-items-center margin-edit-athlete">
            <label className="ms-3 mt-2" style={{color: 'white', fontSize: '20px'}}>Posição Secundária (opcional)</label>
            </div>
            <select className="form-select" name="posicao_secundaria" value={formData.posicao_secundaria} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_secundaria ? '#fff' : '#999'}}>
              <option value="" disabled hidden>Selecione</option>
              <option value="atacante" style={{color: '#fff'}}>Atacante</option>
              <option value="goleiro" style={{color: '#fff'}}>Goleiro</option>
              <option value="lateral" style={{color: '#fff'}}>Lateral</option>
              <option value="meia" style={{color: '#fff'}}>Meia</option>
              <option value="volante" style={{color: '#fff'}}>Volante</option>
              <option value="zagueiro" style={{color: '#fff'}}>Zagueiro</option>
            </select>
          </div>
          <div>
            <div className="d-flex align-items-center">
              <label className="ms-3 mt-2" style={{color: 'white', fontSize: '20px'}}>Outra Posição (opcional)</label>
              </div>
              <select className="form-select" name="posicao_terciaria" value={formData.posicao_terciaria} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_terciaria ? '#fff' : '#999'}}>
              <option value="" disabled hidden>Selecione</option>
                <option value="atacante" style={{color: '#fff'}}>Atacante</option>
                <option value="goleiro" style={{color: '#fff'}}>Goleiro</option>
                <option value="lateral" style={{color: '#fff'}}>Lateral</option>
                <option value="meia" style={{color: '#fff'}}>Meia</option>
                <option value="volante" style={{color: '#fff'}}>Volante</option>
                <option value="zagueiro" style={{color: '#fff'}}>Zagueiro</option>
              </select>
            </div>
            <div>
            <div className="d-flex align-items-center">
                <label className="ms-3 mt-2" style={{color: 'white', fontSize: '20px'}}>Ativo</label>
                </div>
                <select className="form-select" name="ativo" value={formData.ativo} onChange={handleInputChange} style={{height:'45px'}}>
                {/* <option value="" disabled hidden>Selecione</option> */}
                  <option value='true' style={{color: '#fff'}}>Sim</option>
                  <option value="false" style={{color: '#fff'}}>Não</option>
                </select>
            </div>
          </div>
        <div className='ms-3 d-flex flex-column mt-5 pb-3' style={{width: '95%'}}>
          <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick} >Salvar</button>
        </div>
      </div>
    </>
  )
}