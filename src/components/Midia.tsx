/* eslint-disable @next/next/no-img-element */
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Modal, Tab, styled } from "@mui/material";
import React, { useState } from "react";
import LightGallery from 'lightgallery/react';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import styles from "../styles/Gallery.module.css";
import Image from "next/image";
import Subtitle from "./Subtitle";
import AddButton from "./AddButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { saveImage } from "@/pages/api/http-service/gallery";
import { useRouter } from "next/router";

const StyledTab = styled(Tab)({
  color: "#fff",
  "&.Mui-selected": {
    color: "#ff781d",
  },
});

interface AppProps {}
interface AppState {
  settings: LightGallerySettings;
}

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
  overflow: 'auto'
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

export const Midia = () => {
  const [tabValue, setTabValue] = React.useState<string>("imagem");
  const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);
  const [formImage, setFormImage] = React.useState<any>([]);
  const [formListaImage, setFormListaImage] = React.useState<any[]>([]);
  const [formListaImageRequest, setFormListaImageRequest] = React.useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleOpenUploadImage = () => setOpenUploadImage(true);
  const handleCloseUploadImage = () => { 
    setOpenUploadImage(false)
    setFormListaImage([])
    setFormListaImageRequest([])
  };

  const getImageFileObject = (event: any) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file: any) => {
        const objectURL = URL.createObjectURL(file);
        return { file, objectURL };
      });
      setFormListaImage((prevImages) => prevImages.concat(fileArray.map((obj: any) => obj.objectURL)));
      Array.from(files).forEach((file: any) => URL.revokeObjectURL(file));
      setFormListaImageRequest((prevFiles) => prevFiles.concat(Array.from(files)));
      console.log(formListaImageRequest);
    }
  };
  

  const handleDescriptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement> | any) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = event.target.value;
    setDescriptions(newDescriptions);
  };

  const handleSalvarClick = async () => {
    const novosArquivos = [];
    for (const index in formListaImageRequest) {
      if (formListaImageRequest.hasOwnProperty(index)) {
        const arquivo = formListaImageRequest[index];
        if (arquivo instanceof File && arquivo.type) {
          const novoArquivo = new File([arquivo], descriptions[index] ? descriptions[index] : '', { type: arquivo.type });
          novosArquivos.push(novoArquivo);
        }
      }
    }  
    try {
      const formData = new FormData();
      novosArquivos.forEach((file, index) => {
        formData.append(`files${index}`, file);
      });


      console.log(novosArquivos)
      const response = await saveImage(formData, athleteId);
      // handleCloseUploadImage();
  
    } catch (error: any) {
      console.log(error);
    }
  };
  

  const gallery = [
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
    {descricao: 'Título  / Descrição foto', blob: 'https://foothub.com.br/wp-content/uploads/2021/03/gabi-1-768x384.png'},
  ]
  const videos = [
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
    {descricao: 'Título / Descrição vídeo', blob: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=GhyVkC2MnpVrJOmB'},
  ]

  return (
    <div className="mt-4">
       <TabContext value={tabValue}>
          <TabList
            className="row"
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
            TabIndicatorProps={{
              style: {
                backgroundColor: "#ff781d",
                paddingLeft: "5px",
                paddingRight: "5px",
              },
            }}
          >
            <StyledTab className="col" label="Imagem" value="imagem" />
            <StyledTab className="col" label="Vídeo" value="video" />
          </TabList>
          <TabPanel value="imagem" className="mt-3">
          <div className="w-100 text-end mb-3 pe-4" onClick={handleOpenUploadImage}>
            <AddButton />
          </div>
            <div style={{textAlign:'center'}}>
              <LightGallery plugins={[lgZoom, lgVideo]} mode="lg-fade">
                {
                  gallery.map((photo: any, index: number) =>(
                  <a
                    key={index}
                    data-lg-size="1406-1390"
                    className={styles.galleryItem}
                    data-src={photo.blob}
                    data-sub-html={photo.descricao}
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      className={styles.imgResponsive}
                      src={photo.blob}
                      width={220}
                    />
                  </a>
                  ))
                }
              </LightGallery>
            </div>
          </TabPanel>
          <TabPanel value="video" className="mt-3">
              <div className="d-flex justify-content-center row">
            {
              videos.map((video: any, index: number) => (
                <iframe
                key={index}
                  className="m-2 col-md-auto"
                  width="220"
                  height="220"
                  src={video.blob}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ))
            }
            </div>
          </TabPanel>
        </TabContext>
        <Modal
            open={openUploadImage}
            onClose={handleCloseUploadImage}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
            <div className='d-flex justify-content-between'>
              <Subtitle subtitle='Salvar Imagens'/>
              <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseUploadImage}/>
            </div>
            <hr />
            <div className="d-flex justify-content-center align-items-center mb-3">
              <Button
                className="btn-success h-25 mt-5"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" multiple onChange={getImageFileObject}/>
              </Button>
            </div>
            <div className="d-flex flex-column">
              {
                formListaImage.length > 0 ? (
                  formListaImage.map((image: string, index: any) => (
                    <div key={index} className="m-2 text-center d-flex justify-content-between">
                      <img 
                        className="rounded me-3"
                        src={image}
                        width={110}
                        height={'auto'}
                        alt="Uploaded preview"
                        style={{ objectFit: 'cover' }}
                      /> 
                      <textarea 
                        placeholder="Descrição"
                        value={descriptions[index] || ""}
                        onChange={(event) => handleDescriptionChange(index, event)}
                        className="w-100"
                        style={{ resize: "none" }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="mt-5 w-100 d-flex justify-content-center">
                    <Subtitle subtitle="Favor, faça o upload das imagens" />
                  </div>
                )
              }
              <div className='ms-3 d-flex flex-column mt-5 pb-3' style={{width: '95%'}}>
                <button type="button" className="btn btn-success align-self-end" style={{width:'auto'}} onClick={handleSalvarClick} >Salvar</button>
              </div>
            </div>
            </Box>
          </Modal>
    </div>
  );
};
