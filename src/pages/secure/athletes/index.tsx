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
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";
import { Bounce, ToastContainer, toast } from "react-toastify";

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

  const [formContratoClube, setFormContratoClube] = useState({
    contrato_sub_tipo_id: '',
    data_inicio: '',
    data_termino: '',
  });

  const [formContratoEmpresa, setFormContratoEmpresa] = useState({
    contrato_sub_tipo_id: '',
    data_inicio: '',
    data_termino: '',
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
    setFormContratoClube({
      contrato_sub_tipo_id: '',
      data_inicio: '',
      data_termino: '',
    })
    setFormContratoEmpresa({
      contrato_sub_tipo_id: '',
      data_inicio: '',
      data_termino: '',
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

  const handleContratoClubeInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormContratoClube(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContratoEmpresaInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormContratoEmpresa(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleSalvarClick = async () => {
    const request = {
      ...formData,
      clube: formClube,
      contrato_clube: formContratoClube,
      contrato_empresa: formContratoEmpresa,
    };
    try {
      const newAthletesData = await createAthlete(request);
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
            posicao_terciaria: ''
          })
          setFormClube({
            nome: '',
            data_inicio: '',
          })
          setFormContratoClube({
            contrato_sub_tipo_id: '',
            data_inicio: '',
            data_termino: '',
          })
          setFormContratoEmpresa({
            contrato_sub_tipo_id: '',
            data_inicio: '',
            data_termino: '',
          })
        }
        setNewAthlere(false)
        location.reload();
        const athletesData = await getAthletes(1);
          setAthletes(athletesData.data);
          setTotalRow(athletesData.total);
        }

    } catch (error: any) {
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
      formData.posicao_primaria.trim() !== '' &&
      formClube.nome.trim() !== '' &&
      formClube.data_inicio.trim() !== '' &&
      formContratoClube.contrato_sub_tipo_id.trim() !== '' &&
      formContratoClube.data_inicio.trim() !== '' &&
      formContratoClube.data_termino.trim() !== '' &&
      formContratoEmpresa.contrato_sub_tipo_id.trim() !== '' &&
      formContratoEmpresa.data_inicio.trim() !== '' &&
      formContratoEmpresa.data_termino.trim() !== ''
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
            </div>
            <div className="col-md-6" style={{marginRight:'-25px'}}>
            <div className="input w-100 mt-2">
              <div className="d-flex align-items-center">
                <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Clube</label>
                  {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                </div>
                <input type="text" className="form-control input-create bg-dark-custom " placeholder="Digite o nome do clube" name="nome" value={formClube.nome} onChange={handleClubeInputChange} style={{height:'45px'}}/>
              </div>
              <div className="d-flex justify-content-start gap-3 mt-2">
                    <div className="w-100">
                      <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Data Inicio no Clube</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_inicio" value={formClube.data_inicio} onChange={handleClubeInputChange} style={{height:'45px', color:'#999'}} onFocus={() => "this.type='date'"} />
                    </div>
                  </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Contrato Clube</label>
                    {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                  </div>
                  <select className="form-select" name="contrato_sub_tipo_id" value={formContratoClube.contrato_sub_tipo_id} onChange={handleContratoClubeInputChange} style={{height:'45px', color: formContratoClube.contrato_sub_tipo_id ? '#fff' : '#999'}}>
                    <option value="" disabled hidden>Selecione</option>
                    <option value={1} style={{color: '#fff'}}>Profissional</option>
                    <option value={2} style={{color: '#fff'}}>Amador</option>
                    <option value={3} style={{color: '#fff'}}>Temporário</option>
                    {/* <option value={4} style={{color: '#fff'}}>Nenhum</option> */}
                  </select>
              </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  </div>
                  <div className="d-flex justify-content-start gap-3">
                    <div className="w-50">
                      <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Início</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_inicio" value={formContratoClube.data_inicio} onChange={handleContratoClubeInputChange} style={{height:'45px', color:'#999'}} onFocus={() => "this.type='date'"} />
                    </div>
                    <div className="w-50">
                      <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Fim</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_termino" value={formContratoClube.data_termino} onChange={handleContratoClubeInputChange} style={{height:'45px'}}/>
                    </div>
                  </div>
              </div>
              {/* <label className="ms-3 mt-2" style={{color: 'white', fontSize: '20px'}}>Contrato Empresa</label> */}
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Contrato Empresa</label>
                    {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                  </div>
                  <select className="form-select" name="contrato_sub_tipo_id" value={formContratoEmpresa.contrato_sub_tipo_id} onChange={handleContratoEmpresaInputChange} style={{height:'45px', color: formContratoEmpresa.contrato_sub_tipo_id ? '#fff' : '#999'}}>
                    <option value="" disabled hidden>Selecione</option>
                    <option value={1} style={{color: '#fff'}}>Imagem</option>
                    <option value={2} style={{color: '#fff'}}>Agenciamento</option>
                    <option value={6} style={{color: '#fff'}}>Garantias</option>
                    <option value={7} style={{color: '#fff'}}>Material esportivo</option>
                    <option value={8} style={{color: '#fff'}}>Publicidade</option>
                    {/* <option value={4} style={{color: '#fff'}}>Nenhum</option> */}
                  </select>
              </div>
              <div className="input w-100 mt-2">
                <div className="d-flex align-items-center">
                  </div>
                  <div className="d-flex justify-content-start gap-3">
                    <div className="w-50">
                      <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Início</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_inicio" value={formContratoEmpresa.data_inicio} onChange={handleContratoEmpresaInputChange} style={{height:'45px', color:'#999'}} onFocus={() => "this.type='date'"} />
                    </div>
                    <div className="w-50">
                      <label className="ms-3" style={{color: 'white', fontSize: '20px'}}>Fim</label>
                      <input type="date" className="form-control input-create input-date bg-dark-custom " placeholder="selecione a data" name="data_termino" value={formContratoEmpresa.data_termino} onChange={handleContratoEmpresaInputChange} style={{height:'45px'}}/>
                    </div>
                  </div>
              </div>
            </div>
            <div className='ms-3 d-flex flex-column mt-3 pb-3' style={{width: '98%'}}>
              <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick} >Salvar</button>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}
