import Header from "../../../components/Header";
import Search from "../../../components/Search";
import Title from "../../../components/Title";
import AthletesList from "../../../components/AthletesList";
import AddButton from "@/components/AddButton";
import React, { useState } from "react";
import { Box, Button, Modal, colors, styled } from "@mui/material";
import Subtitle from "@/components/Subtitle";
import { createAthlete, getAthletes, uploadImageAthlete } from "@/pages/api/http-service/athletes";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
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

  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    posicao_primaria: '',
    posicao_secundaria: '',
    posicao_terciaria: ''
  });

  const [formClube, setFormClube] = useState({
    nome: '',
    data_inicio: '',
  });

  const [formContrato, setFormContrato] = useState({
    tipo_id: '',
    data_inicio: '',
    data_fim: '',
  });


  const handleOpenCreateAthlete = () => setOpenCreateAthlete(true);
  const handleCloseCreateAthlete = () => {
    setOpenCreateAthlete(false)
    setFormData({
      nome: '',
      data_nascimento: '',
      posicao_primaria: '',
      posicao_secundaria: '',
      posicao_terciaria: ''
    })
    setFormClube({
      nome: '',
      data_inicio: '',
    })
    setFormContrato({
      tipo_id: '',
      data_inicio: '',
      data_fim: '',
    })
    setFormAvatar("/images/image-user.png")
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClubeInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormClube(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContratoInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormContrato(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleSalvarClick = async () => {
    const request = {
      ...formData,
      clube: formClube,
      contrato: formContrato,
    };
    try {
      const athletesData = await createAthlete(request);
      if(athletesData){
        setNewAthlere(true)

        if(formImage){
          const formData = new FormData();
          formData.append('image', formImage);
          const uploadImage = await uploadImageAthlete(athletesData.id, formData);
        }
      }
      // Faça o que precisar com os dados de atleta salvos
    } catch (error) {
      console.error('Error creating athlete:', error);
    } finally {
      handleCloseCreateAthlete();
      setFormData({
        nome: '',
        data_nascimento: '',
        posicao_primaria: '',
        posicao_secundaria: '',
        posicao_terciaria: ''
      })
      setFormClube({
        nome: '',
        data_inicio: '',
      })
      setFormContrato({
        tipo_id: '',
        data_inicio: '',
        data_fim: '',
      })
    }
    setNewAthlere(false)
    location.reload();
    const athletesData = await getAthletes(1);
      setAthletes(athletesData.data);
      setTotalRow(athletesData.total);
  };

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
      formData.posicao_primaria.trim() !== '' &&
      formClube.nome.trim() !== '' &&
      formClube.data_inicio.trim() !== '' &&
      formContrato.tipo_id.trim() !== '' &&
      formContrato.data_inicio.trim() !== '' &&
      formContrato.data_fim.trim() !== ''
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
      <div className="d-flex justify-content-between align-items-center m-3">
        <Title title="Atletas" />
        <div className="input-group w-50">
          <input type="text" className="form-control bg-dark-custom-input " placeholder="Search" aria-label="Search" aria-describedby="inputSearch" value={inputFilter} onChange={handleInputFilter} />
            <span className="clear-input" style={{cursor: 'pointer'}} onClick={handleClickClear}>
            <FontAwesomeIcon icon={faX} style={{color: "#ffffff",}} />
            </span>
          <span className="input-group-text d-flex justify-content-center" id="inputSearch" onClick={handleClick}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#ffffff",}}/>
          </span>
        </div>
      </div>
      <div className="d-flex justify-content-end w-100">
        <div className="me-3" onClick={handleOpenCreateAthlete}>
          <AddButton />
        </div>
      </div>
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
          <div className="d-flex justify-content-between" style={{height:'520px'}}>
            <div className="w-50 pe-4">
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
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Clube</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="text" className="form-control input-create bg-dark-custom " placeholder="Digite o nome do clube" name="nome" value={formClube.nome} onChange={handleClubeInputChange} style={{height:'45px'}}/>
              </div>
              <div className="input w-100 mt-2">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Início Clube</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_inicio" value={formClube.data_inicio} onChange={handleClubeInputChange} style={{height:'45px'}}/>
              </div>
            </div>
            <div className="w-50 pe-4" style={{marginRight:'-25px'}}>
              <div className="input w-100">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Contrato</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <select className="form-select" name="tipo_id" value={formContrato.tipo_id} onChange={handleContratoInputChange} style={{height:'45px', color: formContrato.tipo_id ? '#fff' : '#999'}}>
                  <option value="" disabled hidden>Selecione</option>
                  <option value={1} style={{color: '#fff'}}>Profissional</option>
                  <option value={2} style={{color: '#fff'}}>Amador</option>
                  <option value={3} style={{color: '#fff'}}>Temporário</option>
                  <option value={4} style={{color: '#fff'}}>Nenhum</option>
                </select>
              </div>
              <div className="input w-100 mt-2">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Início do Contrato</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_inicio" value={formContrato.data_inicio} onChange={handleContratoInputChange} style={{height:'45px', color:'#999'}} onFocus={() => "this.type='date'"} 
/>
              </div>
              <div className="input w-100 mt-2">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Fim do Contrato</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_fim" value={formContrato.data_fim} onChange={handleContratoInputChange} style={{height:'45px'}}/>
              </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Posição Principal</label>
                    {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                  </div>
                  <select className="form-select" name="posicao_primaria" value={formData.posicao_primaria} onChange={handleInputChange} style={{height:'45px', color: formData.posicao_primaria ? '#fff' : '#999'}}>
                    {/* <option value="" disabled hidden>Selecione</option> */}
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
                <label className="ms-3 mt-2" style={{color: 'white', fontSize: '20px'}}>Posição Secundária (opcional)</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
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
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
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
              </div>
            </div>
          </div>
          <div className='ms-3 d-flex flex-column mt-5' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick} disabled={!isFormValid()}>Salvar</button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
