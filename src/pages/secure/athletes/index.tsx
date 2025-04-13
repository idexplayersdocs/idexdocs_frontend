import Header from "../../../components/Header";
import Search from "../../../components/Search";
import Title from "../../../components/Title";
import AthletesList from "../../../components/AthletesList";
import AddButton from "@/components/AddButton";
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, colors, styled } from "@mui/material";
import Subtitle from "@/components/Subtitle";
import { createAthlete, getAthletes, uploadImageAthlete } from "@/pages/api/http-service/athletes";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Loading from "react-loading";
import styles from "../../../styles/Login.module.css";
import { jwtDecode } from 'jwt-decode';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto',
};

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

export default function Athletes() {
  const [openCreateAthlete, setOpenCreateAthlete] = useState(false);
  const [formAvatar, setFormAvatar] = useState("/images/image-user.png");
  const [formImage, setFormImage]:any = useState();
  const [newAthlere, setNewAthlere]:any = useState();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [totalRow, setTotalRow]: any = useState();
  const [inputFilter, setInputFilter]: any = useState('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [roles, setRoles] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    if (token) {
      setRoles(decoded.roles[0]);
    }
  }, []);

  const [formData, setFormData] = useState<any>({
    nome: '',
    data_nascimento: '',
    posicao_primaria: '',
    posicao_secundaria: '1',
    posicao_terciaria: '1',
  });


  const handleOpenCreateAthlete = () => setOpenCreateAthlete(true);
  const handleCloseCreateAthlete = () => {
    setOpenCreateAthlete(false)
    setFormData({
      nome: '',
      data_nascimento: '',
      posicao_primaria: '',
      posicao_secundaria: '',
      posicao_terciaria: '',
    })

    setFormAvatar("/images/image-user.png")
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSalvarClick = async () => {
    setIsLoading(true);
    const request = {
      ...formData};
    try {      
      const newAthletesData = await createAthlete(formData);
      if(newAthletesData){
        setNewAthlere(true)

        if(formImage){
          const formData = new FormData();
          formData.append('image', formImage);
          const uploadImage = await uploadImageAthlete(newAthletesData.id, formData);

          handleCloseCreateAthlete();
          setFormData({
            nome: '',
            data_nascimento: '',
            posicao_primaria: '',
            posicao_secundaria: '',
            posicao_terciaria: '',
          })
        }
        setNewAthlere(false)
        location.reload();
        const athletesData = await getAthletes(1);
          setAthletes(athletesData.data);
          setTotalRow(athletesData.total);
        }

    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  }

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

  // function runAfterImageDelete(file:any) {
  //   console.log({ file })
  // }

  const isFormValid = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      formData.nome.trim() !== '' &&
      formData.data_nascimento.trim() !== '' &&
      formData.posicao_primaria.trim() !== ''
      // formClube.nome.trim() !== '' &&
      // formClube.data_inicio.trim() !== '' &&
      // formContratoClube.contrato_sub_tipo_id.trim() !== '' &&
      // formContratoClube.data_inicio.trim() !== '' &&
      // formContratoClube.data_termino.trim() !== '' &&
      // formContratoEmpresa.contrato_sub_tipo_id.trim() !== '' &&
      // formContratoEmpresa.data_inicio.trim() !== '' &&
      // formContratoEmpresa.data_termino.trim() !== ''
    ) {
      return true; // Todos os campos estão preenchidos
    } else {
      return false; // Algum campo está vazio
    }
  };


  const handleInputFilter = (event: any) => {
    setInputFilter(event.target.value);
  };

  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(clickCount + 1);
  };

  const handleClickClear = () => {
    setInputFilter('')
    setClickCount(clickCount + 1);
  };
  
  return (
    <>
      <Header />
      <div className="m-3">
        <div className="row">
          <div className="col-lg">
            <Title title="Atletas" />
          </div>
          <div className="input-group w-50 col-lg w-100">
            <input type="text" className="form-control bg-dark-custom-input " placeholder="Buscar" aria-label="Search" aria-describedby="inputSearch" value={inputFilter} onChange={handleInputFilter} />
              <span className="clear-input" style={{cursor: 'pointer'}} onClick={handleClickClear}>
              <FontAwesomeIcon icon={faX} style={{color: "#ffffff",}} />
              </span>
            <span className="input-group-text d-flex justify-content-center" id="inputSearch" onClick={handleClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#ffffff",}}/>
            </span>
          </div>
        </div>
      </div>
      {
        roles == 'admin' &&
        <div className="d-flex justify-content-end w-100">
          <div className="me-3" onClick={handleOpenCreateAthlete}>
            <AddButton />
          </div>
        </div>
      }
      <AthletesList newAthlete={newAthlere} inputFilter={inputFilter} searchFilter={clickCount}/>
      <Modal
        open={openCreateAthlete}
        onClose={handleCloseCreateAthlete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Criação do atleta"/>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff", cursor: 'pointer'}} size="xl" onClick={handleCloseCreateAthlete}/>
          </div>
          <hr />
          <div className="row" style={{height:'520px'}}>
            <div className="col-md-5 d-flex">
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
                    className="btn-success w-100"
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
            </div>
            <div className="d-flex flex-column align-content-center justify-content-center col-md-7">
            <div className="input w-100">
                <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px', marginTop:'14px'}}>Nome</label>
                {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="text" className="form-control input-create bg-dark-custom " placeholder="Digite o nome do atleta" name="nome" value={formData.nome} onChange={handleInputChange} style={{height:'45px'}}/>
              </div>
              <div className="input w-100 mt-2">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data de nascimento</label>
                </div>
                <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_nascimento" value={formData.data_nascimento} onChange={handleInputChange} style={{height:'45px'}}/>
              </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Posição principal</label>
                  </div>
                  <select className="form-select" name="posicao_primaria" value={formData.posicao_primaria} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_primaria ? '#fff' : '#999'}}>
                    <option value="" disabled hidden>SELECIONE</option>
                    <option value={2} style={{color: '#fff'}}>GOLEIRO</option>
                    <option value={3} style={{color: '#fff'}}>LATERAL DIREITO</option>
                    <option value={4} style={{color: '#fff'}}>LATERAL ESQUERDO</option>
                    <option value={5} style={{color: '#fff'}}>ZAGUEIRO</option>
                    <option value={6} style={{color: '#fff'}}>VOLANTE</option>
                    <option value={7} style={{color: '#fff'}}>MEIA ARMADOR</option>
                    <option value={8} style={{color: '#fff'}}>MEIA ATACANTE</option>
                    <option value={9} style={{color: '#fff'}}>ATACANTE</option>
                    <option value={10} style={{color: '#fff'}}>CENTROAVANTE</option>
                    <option value={11} style={{color: '#fff'}}>EXTREMO DIREITO</option>
                    <option value={12} style={{color: '#fff'}}>EXTREMO ESQUERDO</option>     
                  </select>
                </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Posição secundária</label>
                  </div>
                  <select className="form-select" name="posicao_secundaria" value={formData.posicao_secundaria || ''} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_secundaria ? '#fff' : '#999'}}>
                    <option value={1} style={{color: '#fff'}}>NENHUM</option>
                    <option value={2} style={{color: '#fff'}}>GOLEIRO</option>
                    <option value={3} style={{color: '#fff'}}>LATERAL DIREITO</option>
                    <option value={4} style={{color: '#fff'}}>LATERAL ESQUERDO</option>
                    <option value={5} style={{color: '#fff'}}>ZAGUEIRO</option>
                    <option value={6} style={{color: '#fff'}}>VOLANTE</option>
                    <option value={7} style={{color: '#fff'}}>MEIA ARMADOR</option>
                    <option value={8} style={{color: '#fff'}}>MEIA ATACANTE</option>
                    <option value={9} style={{color: '#fff'}}>ATACANTE</option>
                    <option value={10} style={{color: '#fff'}}>CENTROAVANTE</option>
                    <option value={11} style={{color: '#fff'}}>EXTREMO DIREITO</option>
                    <option value={12} style={{color: '#fff'}}>EXTREMO ESQUERDO</option>                         
                  </select>
                </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Outra posição</label>
                  </div>
                  <select className="form-select" name="posicao_terciaria" value={formData.posicao_terciaria  || ''} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_terciaria ? '#fff' : '#999'}}>
                    <option value={1} style={{color: '#fff'}}>NENHUM</option>
                    <option value={2} style={{color: '#fff'}}>GOLEIRO</option>
                    <option value={3} style={{color: '#fff'}}>LATERAL DIREITO</option>
                    <option value={4} style={{color: '#fff'}}>LATERAL ESQUERDO</option>
                    <option value={5} style={{color: '#fff'}}>ZAGUEIRO</option>
                    <option value={6} style={{color: '#fff'}}>VOLANTE</option>
                    <option value={7} style={{color: '#fff'}}>MEIA ARMADOR</option>
                    <option value={8} style={{color: '#fff'}}>MEIA ATACANTE</option>
                    <option value={9} style={{color: '#fff'}}>ATACANTE</option>
                    <option value={10} style={{color: '#fff'}}>CENTROAVANTE</option>
                    <option value={11} style={{color: '#fff'}}>EXTREMO DIREITO</option>
                    <option value={12} style={{color: '#fff'}}>EXTREMO ESQUERDO</option>                         
                  </select>
                </div>
            </div>
            <div className='ms-3 d-flex flex-column mt-3 pb-3' style={{width: '98%'}}>
              <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick} disabled={!isFormValid()}>Salvar</button>
            </div>
          </div>
        </Box>
      </Modal>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles.overlay}`}
            >
              <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
            </div>
          ) : null}
      <ToastContainer />
    </>
  );
}
