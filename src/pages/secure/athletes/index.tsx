import Header from "../../../components/Header";
import Search from "../../../components/Search";
import Title from "../../../components/Title";
import AthletesList from "../../../components/AthletesList";
import AddButton from "@/components/AddButton";
import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import Subtitle from "@/components/Subtitle";
import { createAthlete } from "@/pages/api/http-service/athletes";

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
  borderRadius: '20px'
};

export default function Athletes() {
  const [openCreateAthlete, setOpenCreateAthlete] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    posicao_id: '',
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
  const handleCloseCreateAthlete = () => setOpenCreateAthlete(false);

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

    console.log(request);

    try {
      const athletesData = await createAthlete(request);
      console.log(athletesData);
      // Faça o que precisar com os dados de atleta salvos
    } catch (error) {
      console.error('Error creating athlete:', error);
    } finally {
      handleCloseCreateAthlete();
      setFormData({
        nome: '',
        data_nascimento: '',
        posicao_id: '',
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
  };

  return (
    <>
      <Header />
      <div className="d-flex justify-content-between align-items-center m-3">
        <Title title="Atletas" />
        <Search />
      </div>
      <div className="d-flex justify-content-end w-100">
        <div className="me-3" onClick={handleOpenCreateAthlete}>
          <AddButton />
        </div>
      </div>
      <AthletesList />
      <Modal
        open={openCreateAthlete}
        onClose={handleCloseCreateAthlete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Subtitle subtitle="Criação do atleta"/>
          <hr />
          <div className="d-flex justify-content-between" style={{height:'500px'}}>
            <div className="w-50 pe-4">
              <div className="input w-100">
                <Subtitle subtitle="Nome"/>
                <input type="text" className="form-control input-create bg-dark" placeholder="Digite o nome do atleta" name="nome" value={formData.nome} onChange={handleInputChange} />
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Data de Nascimento"/>
                <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_nascimento" value={formData.data_nascimento} onChange={handleInputChange}/>
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Clube"/>
                <input type="text" className="form-control input-create bg-dark" placeholder="Digite o nome do clube" name="nome" value={formClube.nome} onChange={handleClubeInputChange}/>
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Data Início do Clube"/>
                <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_inicio" value={formClube.data_inicio} onChange={handleClubeInputChange}/>
              </div>
            </div>
            <div className="w-50 pe-4">
              <div className="input w-100">
                <Subtitle subtitle="Contrato"/>
                <select className="form-select" name="tipo_id" value={formContrato.tipo_id} onChange={handleContratoInputChange}>
                  <option value="">Selecione o Contrato</option>
                  <option value={1}>Profissional</option>
                  <option value={2}>Amador</option>
                  <option value={3}>Temporário</option>
                  <option value={4}>Nenhum</option>
                </select>
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Data Início do contrato"/>
                <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_inicio" value={formContrato.data_inicio} onChange={handleContratoInputChange}/>
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Data Fim do contrato"/>
                <input type="date" className="form-control input-create input-date bg-dark" placeholder="selecione a data" name="data_fim" value={formContrato.data_fim} onChange={handleContratoInputChange}/>
              </div>
              <div className="input w-100 mt-3">
                <Subtitle subtitle="Posicao"/>
                <select className="form-select" name="posicao_id" value={formData.posicao_id} onChange={handleInputChange}>
                  <option value="">Selecione a Posição</option>
                  <option value={1}>Atacante</option>
                  <option value={2}>Goleiro</option>
                  <option value={3}>Lateral</option>
                  <option value={4}>Meia</option>
                  <option value={5}>Volante</option>
                  <option value={6}>Zagueiro</option>
                </select>
              </div>
            </div>
          </div>
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick}>Salvar</button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
