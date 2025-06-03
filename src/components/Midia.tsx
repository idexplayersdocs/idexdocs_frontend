/* eslint-disable @next/next/no-img-element */
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Modal, Tab, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import { LightGallerySettings } from "lightgallery/lg-settings";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import styles from "../styles/Gallery.module.css";
import styles2 from "../styles/Login.module.css";
import Image from "next/image";
import Subtitle from "./Subtitle";
import AddButton from "./AddButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faPenToSquare,
  faTableCellsLarge,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  deleteImage,
  deleteVideo,
  editImage,
  editVideo,
  getGalleryById,
  getVideosById,
  saveImage,
  uploadVideo,
  uploadVideoYoutube,
  saveLink,
  fetchLinkbyAthleteId,
  deleteLink,
} from "@/pages/api/http-service/gallery";
import { useRouter } from "next/router";
import Loading from "react-loading";
import ReactPlayer from "react-player";

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
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "var(--bg-primary-color)",
  border: "1px solid var(--color-line)",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  height: "95%",
  overflow: "auto",
};
const styleEdit = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "var(--bg-primary-color)",
  border: "1px solid var(--color-line)",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  height: "auto",
  overflow: "auto",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const Midia = () => {
  const [tabValue, setTabValue] = React.useState<string>("imagem");
  const [tabValueVideo, setTabValueVideo] = React.useState<string>("upload");
  const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);
  // LINKS
  const [openUploadLink, setOpenUploadLink] = useState<boolean>(false);
  const [linkFormData, setLinkFormData] = useState({ url: "", descricao: "" });
  const isFormValid =
    linkFormData.url.trim() !== "" && linkFormData.descricao.trim() !== "";

  const [openEditImage, setOpenEditImage] = useState<boolean>(false);
  const [openEditVideo, setOpenEditVideo] = useState<boolean>(false);
  const [openDeleteImage, setOpenDeleteImage] = useState<boolean>(false);
  const [openDeleteVideo, setOpenDeleteVideo] = useState<boolean>(false);
  const [openUploadVideo, setOpenUploadVideo] = useState<boolean>(false);
  const [formImage, setFormImage] = React.useState<any>({
    imagem_id: "",
    descricao: "",
    blob_url: "",
  });
  const [formListaImage, setFormListaImage] = React.useState<any[]>([]);
  const [formListaImageRequest, setFormListaImageRequest] = React.useState<
    any[]
  >([]);
  const [formListaVideo, setFormListaVideo] = React.useState<any[]>([]);
  const [formListaVideoRequest, setFormListaVideoRequest] = React.useState<
    any[]
  >([]);
  const [formDataVideo, setFormDataVideo] = React.useState<any>({
    id: "",
    blob_url: "",
    descricao: "",
  });
  const [formVideo, setFormVideo] = React.useState<any>();
  const [descriptions, setDescriptions] = useState<string[]>([]);

  // Lista dos conteúdos principais da página
  const [gallery, setGallery] = useState<any[]>([]);
  const [link, setLink] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  const [table, setTable] = useState<string>("list");
  const [tableVideo, setTableVideo] = useState<string>("list");
  const [formLinkYoutube, setFormLinkYoutube] = useState<any>({
    video_url: "",
  });
  const [loading, setLoading] = useState(true);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const selectTable = (table: string) => {
    setTable(table);
  };

  const selectTableVideo = (table: string) => {
    setTableVideo(table);
  };

  const resetFormVideo = () => {
    setFormLinkYoutube({
      video_url: "",
    });
    setFormVideo(null);
    setFormListaVideo([]);
  };

  const handleInputChangeUrl = (
    event: React.ChangeEvent<HTMLInputElement | any>
  ) => {
    const { name, value } = event.target;
    setFormLinkYoutube((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const handleChangeVideo = (event: React.SyntheticEvent, newValue: string) => {
    setTabValueVideo(newValue);
  };

  const handleOpenUploadImage = () => setOpenUploadImage(true);
  const handleOpenUploadLink = () => setOpenUploadLink(true);

  const handleCloseUploadImage = () => {
    setOpenUploadImage(false);
    setFormListaImage([]);
    setFormListaImageRequest([]);
    setDescriptions([]);
  };

  const handleCloseUploadLink = () => {
    setOpenUploadLink(false);
    setLinkFormData({ url: "", descricao: "" });
  };

  const handleOpenEditVideo = (photo: any) => {
    setFormDataVideo({
      id: photo.id,
      descricao: photo.descricao,
      blob_url: photo.blob_url,
    });
    setOpenEditVideo(true);
  };

  const handleOpenEditImage = (photo: any) => {
    setFormImage({
      imagem_id: photo.id,
      descricao: photo.descricao,
      blob_url: photo.blob_url,
    });
    setOpenEditImage(true);
  };

  const handleCloseEditImage = () => {
    setOpenEditImage(false);
    setFormImage({
      imagem_id: "",
      descricao: "",
      blob_url: "",
    });
  };

  const handleCloseEditVideo = () => {
    setOpenEditVideo(false);
    setFormDataVideo({
      id: "",
      descricao: "",
      blob_url: "",
    });
  };

  const handleOpenDeleteImage = (photo: any) => {
    setFormImage({
      imagem_id: photo.id,
      descricao: photo.descricao,
      blob_url: photo.blob_url,
    });
    setOpenDeleteImage(true);
  };

  const handleOpenDeleteVideo = (video: any) => {
    setFormDataVideo({
      id: video.id,
      descricao: video.descricao,
      blob_url: video.blob_url,
    });
    setOpenDeleteVideo(true);
  };

  const handleCloseDeleteImage = () => {
    setOpenDeleteImage(false);
    setFormImage({
      imagem_id: "",
      descricao: "",
      blob_url: "",
    });
    setDescriptions([]);
  };

  const handleCloseDeleteVideo = () => {
    setOpenDeleteVideo(false);
    setFormDataVideo({
      id: "",
      descricao: "",
      blob_url: "",
    });
    setDescriptions([]);
    setFormListaVideoRequest([]);
    setFormListaVideo([]);
  };
  const handleOpenUploadVideo = () => setOpenUploadVideo(true);
  const handleCloseUploadVideo = () => {
    setOpenUploadVideo(false);
    setFormVideo(null);
    setFormDataVideo({
      id: "",
      blob_url: "",
      descricao: "",
    });
    setDescriptions([]);
    setFormListaVideoRequest([]);
    setFormListaVideo([]);
    setFormLinkYoutube({
      video_url: "",
    });
  };

  const getImageFileObject = (event: any) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file: any) => {
        const objectURL = URL.createObjectURL(file);
        return { file, objectURL };
      });
      setFormListaImage((prevImages) =>
        prevImages.concat(fileArray.map((obj: any) => obj.objectURL))
      );
      Array.from(files).forEach((file: any) => URL.revokeObjectURL(file));
      setFormListaImageRequest((prevFiles) =>
        prevFiles.concat(Array.from(files))
      );
    }
  };

  const getVideoFileObject = (event: any) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file: any) => {
        const objectURL = URL.createObjectURL(file);
        return { file, objectURL };
      });
      setFormListaVideo((prevVideos) =>
        prevVideos.concat(fileArray.map((obj: any) => obj.objectURL))
      );
      Array.from(files).forEach((file: any) => URL.revokeObjectURL(file));
      setFormListaVideoRequest((prevFiles) =>
        prevFiles.concat(Array.from(files))
      );

      const file = event.target.files[0];
      const reader: any = new FileReader();

      reader.readAsDataURL(file);
      setFormVideo(file);
    }
  };

  const handleDescriptionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = event.target.value;
    setDescriptions(newDescriptions);
  };

  const handleSalvarClick = async () => {
    setIsLoading(true);

    const novosArquivos = [];
    for (const index in formListaImageRequest) {
      if (formListaImageRequest.hasOwnProperty(index)) {
        const arquivo = formListaImageRequest[index];
        if (arquivo instanceof File && arquivo.type) {
          const novoArquivo = new File(
            [arquivo],
            descriptions[index] ? descriptions[index] : "",
            { type: arquivo.type }
          );
          novosArquivos.push(novoArquivo);
        }
      }
    }
    try {
      const formData = new FormData();
      novosArquivos.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await saveImage(formData, athleteId);
      handleCloseUploadImage();
      const galleryData = await getGalleryById(athleteId);
      setGallery(galleryData.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(event.target);
    setLinkFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSalvarLink = async () => {
    const { url, descricao } = linkFormData;

    try {
      const atleta_id = athleteId;
      const payload = { url, descricao, atleta_id };
      const response = await saveLink(payload);
      handleCloseUploadLink();
      const linkData = await fetchLinkbyAthleteId(athleteId);
      setLink(linkData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvarClickVideo = async () => {
    setIsLoading(true);

    const novosArquivos = [];
    for (const index in formListaVideoRequest) {
      if (formListaVideoRequest.hasOwnProperty(index)) {
        const arquivo = formListaVideoRequest[index];
        if (arquivo instanceof File && arquivo.type) {
          const novoArquivo = new File(
            [arquivo],
            descriptions[index] ? descriptions[index] : "",
            { type: arquivo.type }
          );
          novosArquivos.push(novoArquivo);
        }
      }
    }
    try {
      // const formData = new FormData();
      // novosArquivos.forEach((file, index) => {
      //   formData.append(`files`, file);
      // });
      const formData = new FormData();
      formData.append("video", formVideo);
      const response = await uploadVideo(athleteId, formData);
      const videosData = await getVideosById(athleteId);
      setVideos(videosData.data);
      handleCloseUploadVideo();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Imagem
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const galleryData = await getGalleryById(athleteId);
        setGallery(galleryData.data);
        // setAthletes((prevAthletes) => [...prevAthletes, newAthlete]);
        // setTotalRow(athletesData.total);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, [athleteId]);

  // Video
  useEffect(() => {
    const fetchVideosData = async () => {
      try {
        const videosData = await getVideosById(athleteId);
        setVideos(videosData.data);
        // setAthletes((prevAthletes) => [...prevAthletes, newAthlete]);
        // setTotalRow(athletesData.total);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideosData();
  }, [athleteId]);

  // Link
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const linksData = await fetchLinkbyAthleteId(athleteId);
        setLink(linksData.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkData();
  }, [athleteId]);

  const saveEditVideo = async () => {
    setIsLoading(true);
    try {
      const response = await editVideo(formDataVideo);
      const fetchVideosData = async () => {
        try {
          const videosData = await getVideosById(athleteId);
          setVideos(videosData.data);
        } catch (error) {
          console.error("Error fetching athletes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVideosData();
      handleCloseEditVideo();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEditImage = async () => {
    setIsLoading(true);

    try {
      const response = await editImage(formImage);
      const fetchGalleryData = async () => {
        try {
          const galleryData = await getGalleryById(athleteId);
          setGallery(galleryData.data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchGalleryData();
      handleCloseEditImage();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveYoutubeLink = async () => {
    setIsLoading(true);

    try {
      const response = await uploadVideoYoutube(athleteId, formLinkYoutube);
      const videosData = await getVideosById(athleteId);
      setVideos(videosData.data);
      handleCloseUploadVideo();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDeleteVideo = async () => {
    setIsLoading(true);

    try {
      const response = await deleteVideo(formDataVideo.id);
      // handleCloseCreateAthlete();
      const fetchVideosData = async () => {
        try {
          const videosData = await getVideosById(athleteId);
          setVideos(videosData.data);
          // setAthletes((prevAthletes) => [...prevAthletes, newAthlete]);
          // setTotalRow(athletesData.total);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVideosData();
      handleCloseDeleteVideo();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDeleteImage = async () => {
    setIsLoading(true);

    try {
      const response = await deleteImage(formImage.imagem_id);
      // handleCloseCreateAthlete();
      const fetchGalleryData = async () => {
        try {
          const galleryData = await getGalleryById(athleteId);
          setGallery(galleryData.data);
        } catch (error) {
          console.error("Error fetching athletes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchGalleryData();
      handleCloseDeleteImage();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDeleteLink = async (linkId: string) => {
    setIsLoading(true);

    const fetchLinkData = async () => {
      try {
        const linksData = await fetchLinkbyAthleteId(athleteId);
        setLink(linksData.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    try {
      const response = await deleteLink(linkId);
      fetchLinkData();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { name, value } = event.target;
    setFormImage((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditVideo = (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { name, value } = event.target;
    setFormDataVideo((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100 h-100"
        style={{ marginTop: "150px" }}
      >
        <Loading type="bars" color="var(--bg-ternary-color)" width={100} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <TabContext value={tabValue}>
        {/* Todas as tabs */}
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
          <StyledTab className="col" label="Link" value="link" />
        </TabList>
        {/* Imagem */}
        <TabPanel value="imagem" className="mt-3">
          <div
            className="w-100 text-end mb-3 pe-4"
            onClick={handleOpenUploadImage}
          >
            <AddButton />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginBottom: "50px",
                gap: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faListUl}
                size="2xl"
                style={{
                  color: table == "list" ? "#ff781d" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => selectTable("list")}
              />
              <FontAwesomeIcon
                icon={faTableCellsLarge}
                size="2xl"
                style={{
                  color: table == "card" ? "#ff781d" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => selectTable("card")}
              />
            </div>
            {table == "card" && (
              <LightGallery plugins={[lgZoom, lgVideo]} mode="lg-fade">
                {gallery.map((photo: any, index: number) => (
                  <a
                    key={index}
                    data-lg-size="1406-1390"
                    className={styles.galleryItem}
                    data-src={photo.blob_url}
                    data-sub-html={photo.descricao}
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      className={styles.imgResponsive}
                      src={photo.blob_url}
                      width={200}
                    />
                  </a>
                ))}
              </LightGallery>
            )}
            {table == "list" && (
              <div className="w-100 mt-3 mb-3" style={{ overflow: "auto" }}>
                <table className="table table-striped">
                  <tbody>
                    {gallery.length > 0 ? (
                      gallery.map((photo, index: number) => (
                        <tr key={index}>
                          <td className="table-dark text-start">
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <img src={photo.blob_url} height={50} />
                          </td>
                          <td
                            className="table-dark text-center"
                            style={{ verticalAlign: "middle" }}
                          >
                            {photo.descricao}
                          </td>
                          <td
                            className="table-dark text-end"
                            style={{
                              whiteSpace: "nowrap",
                              verticalAlign: "middle",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              size="xl"
                              style={{
                                color: "#ff0000",
                                marginRight: "10px",
                                marginTop: "auto",
                                marginBottom: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() => handleOpenDeleteImage(photo)}
                            />
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="xl"
                              style={{ color: "#ffffff", cursor: "pointer" }}
                              onClick={() => handleOpenEditImage(photo)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="table-dark text-center">
                          Galeria de imagens vazia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabPanel>
        {/* Video */}
        <TabPanel value="video" className="mt-3">
          <div
            className="w-100 text-end mb-3 pe-4"
            onClick={handleOpenUploadVideo}
          >
            <AddButton />
          </div>
          <div className="d-flex justify-content-center row">
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginBottom: "50px",
                gap: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faListUl}
                size="2xl"
                style={{
                  color: tableVideo == "list" ? "#ff781d" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => selectTableVideo("list")}
              />
              <FontAwesomeIcon
                icon={faTableCellsLarge}
                size="2xl"
                style={{
                  color: tableVideo == "card" ? "#ff781d" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => selectTableVideo("card")}
              />
            </div>
            {
              tableVideo == "card" &&
                // videos.length > 0 ? (
                videos.map((video: any, index: number) => (
                  // <iframe
                  // key={index}
                  //   className="m-2 col-md-auto"
                  //   width="220"
                  //   height="220"
                  //   src={video.blob_url}
                  //   frameBorder="0"
                  //   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  //   allowFullScreen
                  // ></iframe>
                  <ReactPlayer
                    className="m-2 col-md-auto"
                    width={250}
                    height={220}
                    key={index}
                    url={video.blob_url}
                    controls
                  />
                ))

              // ): (
              //   <div className="d-flex justify-content-center w-100">
              //     <Subtitle subtitle="Lista de vídeos vazia"/>
              //   </div>
              // )
            }
            {tableVideo == "list" && (
              <div className="w-100 mt-3 mb-3" style={{ overflow: "auto" }}>
                <table className="table table-striped">
                  <tbody>
                    {videos.length > 0 ? (
                      videos.map((video, index: number) => (
                        <tr key={index}>
                          <td className="table-dark text-start">
                            {/* <iframe
                            className="m-2 col-md-auto"
                            height="50"
                            src={video.blob_url}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{width: '150px', height: '100px'}}
                          ></iframe> */}
                            <ReactPlayer
                              className="m-2 col-md-auto"
                              width={150}
                              height={100}
                              url={video.blob_url}
                              controls
                            />
                          </td>
                          <td
                            className="table-dark text-center"
                            style={{ verticalAlign: "middle" }}
                          >
                            {video.descricao}
                          </td>
                          <td
                            className="table-dark text-end"
                            style={{
                              whiteSpace: "nowrap",
                              verticalAlign: "middle",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              size="xl"
                              style={{
                                color: "#ff0000",
                                marginRight: "10px",
                                marginTop: "auto",
                                marginBottom: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() => handleOpenDeleteVideo(video)}
                            />
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="xl"
                              style={{ color: "#ffffff", cursor: "pointer" }}
                              onClick={() => handleOpenEditVideo(video)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="table-dark text-center">
                          Lista de vídeos vazia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabPanel>
        {/* Link */}
        <TabPanel value="link" className="mt-3">
          <div
            className="w-100 text-end mb-3 pe-4"
            onClick={handleOpenUploadLink}
          >
            <AddButton />
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="w-100 mt-3 mb-3" style={{ overflow: "auto" }}>
              <table className="table table-striped">
                <tbody>
                  {link.length > 0 ? (
                    link.map((link, index: number) => (
                      <tr key={index}>
                        <td
                          className="table-dark text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <a
                            href={link.url}
                            style={{
                              textDecoration: "none",
                              color: "white",
                              cursor: "pointer",
                            }}
                            target="_blank"
                          >
                            {link.descricao
                              ? link.descricao
                              : "Link sem descrição"}
                          </a>
                        </td>
                        <td
                          className="table-dark text-end"
                          style={{
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            size="xl"
                            style={{
                              color: "#ff0000",
                              marginRight: "10px",
                              marginTop: "auto",
                              marginBottom: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() => saveDeleteLink(link.id)}
                          />
                          {/* <FontAwesomeIcon icon={faPenToSquare} size="xl" style={{ color: "#ffffff", cursor: 'pointer' }} onClick={() => handleOpenEditImage(link)} /> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="table-dark text-center">
                        Lista de links vazia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
      </TabContext>
      {/* Upload image */}
      <Modal
        open={openUploadImage}
        onClose={handleCloseUploadImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Salvar Imagens" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseUploadImage}
            />
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
              <VisuallyHiddenInput
                type="file"
                multiple
                onChange={getImageFileObject}
              />
            </Button>
          </div>
          <div className="d-flex flex-column">
            {formListaImage.length > 0 ? (
              formListaImage.map((image: string, index: any) => (
                <div
                  key={index}
                  className="m-2 text-center d-flex justify-content-between"
                >
                  <img
                    className="rounded me-3"
                    src={image}
                    width={110}
                    height={"auto"}
                    alt="Uploaded preview"
                    style={{ objectFit: "cover" }}
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
            )}
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: "auto" }}
                onClick={handleSalvarClick}
              >
                Salvar
              </button>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Delete video */}
      <Modal
        open={openDeleteVideo}
        onClose={handleCloseDeleteVideo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleEdit}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Remover Imagem" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseDeleteVideo}
            />
          </div>
          <hr />
          <div className="d-flex flex-column">
            <div className="m-2 text-center d-flex flex-column align-items-center justify-content-center">
              {/* <iframe
                  className="m-2 col-md-auto"
                  height="50"
                  src={formDataVideo.blob_url}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{width: '200px', height: '100px'}}
                ></iframe> */}
              <ReactPlayer
                className="m-2 col-md-auto"
                width={200}
                height={100}
                url={formDataVideo.blob_url}
                controls
              />

              <div style={{ marginTop: "20px" }}>
                <Subtitle subtitle="Certeza que deseja remover o vídeo?" />
              </div>
            </div>
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-success align-self-end"
                  style={{ width: "auto" }}
                  onClick={saveDeleteVideo}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className="btn btn-secondary align-self-end"
                  style={{ width: "auto", backgroundColor: "#626262" }}
                  onClick={handleCloseDeleteImage}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Delete image */}
      <Modal
        open={openDeleteImage}
        onClose={handleCloseDeleteImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleEdit}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Remover Imagem" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseDeleteImage}
            />
          </div>
          <hr />
          <div className="d-flex flex-column">
            <div className="m-2 text-center d-flex flex-column align-items-center justify-content-center">
              <img
                className="rounded me-3"
                src={formImage.blob_url}
                width={200}
                height={"auto"}
                alt="Uploaded preview"
                style={{ objectFit: "cover" }}
              />
              <div style={{ marginTop: "20px" }}>
                <Subtitle subtitle="Certeza que deseja remover a imagem?" />
              </div>
            </div>
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-success align-self-end"
                  style={{ width: "auto" }}
                  onClick={saveDeleteImage}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className="btn btn-secondary align-self-end"
                  style={{ width: "auto", backgroundColor: "#626262" }}
                  onClick={handleCloseDeleteImage}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Edit video */}
      <Modal
        open={openEditVideo}
        onClose={handleCloseEditImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleEdit}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Video" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseEditVideo}
            />
          </div>
          <hr />
          <div className="d-flex flex-column">
            <div className="m-2 text-center d-flex justify-content-between">
              <iframe
                className="m-2 col-md-auto"
                height="50"
                src={formDataVideo.blob_url}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "150px", height: "100px" }}
              ></iframe>
              <textarea
                placeholder="Descrição"
                name="descricao"
                value={formDataVideo.descricao}
                onChange={handleEditVideo}
                className="w-100"
                style={{ resize: "none" }}
              />
            </div>
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: "auto" }}
                onClick={saveEditVideo}
              >
                Salvar
              </button>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Edit image */}
      <Modal
        open={openEditImage}
        onClose={handleCloseEditImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleEdit}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar Imagem" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseEditImage}
            />
          </div>
          <hr />
          <div className="d-flex flex-column">
            <div className="m-2 text-center d-flex justify-content-between">
              <img
                className="rounded me-3"
                src={formImage.blob_url}
                width={110}
                height={"auto"}
                alt="Uploaded preview"
                style={{ objectFit: "cover" }}
              />
              <textarea
                placeholder="Descrição"
                name="descricao"
                value={formImage.descricao}
                onChange={handleEditImage}
                className="w-100"
                style={{ resize: "none" }}
              />
            </div>
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: "auto" }}
                onClick={saveEditImage}
              >
                Salvar
              </button>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Upload video */}
      <Modal
        open={openUploadVideo}
        onClose={handleCloseUploadVideo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Salvar Vídeos" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseUploadVideo}
            />
          </div>
          <hr />

          <TabContext value={tabValueVideo}>
            <TabList
              className="row"
              onChange={handleChangeVideo}
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
              <StyledTab
                className="col"
                label="Upload"
                value="upload"
                onClick={resetFormVideo}
              />
              <StyledTab className="col" label="Youtube" value="youtube" />
            </TabList>
            <TabPanel value="upload" className="mt-3">
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
                  <VisuallyHiddenInput
                    type="file"
                    onChange={getVideoFileObject}
                  />
                </Button>
              </div>
              <div className="d-flex flex-column">
                {formListaVideo.length > 0 ? (
                  formListaVideo.map((video: string, index: any) => (
                    <div
                      key={index}
                      className="m-2 text-center d-flex justify-content-between"
                    >
                      <video
                        controls
                        width="250"
                        style={{ objectFit: "cover", marginRight: "10px" }}
                      >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <textarea
                        placeholder="Descrição"
                        value={descriptions[index] || ""}
                        onChange={(event) =>
                          handleDescriptionChange(index, event)
                        }
                        className="w-100"
                        style={{ resize: "none" }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="mt-5 w-100 d-flex justify-content-center">
                    <Subtitle subtitle="Favor, faça o upload dos vídeos" />
                  </div>
                )}
                <div
                  className="ms-3 d-flex flex-column mt-5 pb-3"
                  style={{ width: "95%" }}
                >
                  <button
                    type="button"
                    className="btn btn-success align-self-end"
                    style={{ width: "auto" }}
                    onClick={handleSalvarClickVideo}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="youtube" className="mt-3">
              <div className="d-flex justify-content-center row">
                <div className="input w-100">
                  <div className="d-flex align-items-center">
                    <label
                      className="ms-3"
                      style={{
                        color: "white",
                        fontSize: "20px",
                        marginTop: "14px",
                      }}
                    >
                      Link do Youtube
                    </label>
                    {/* <FontAwesomeIcon icon={faAsterisk} color="red" className="ms-2"/> */}
                  </div>
                  <input
                    type="text"
                    className="form-control input-create bg-dark-custom "
                    placeholder="Cole o link do Youtube"
                    name="video_url"
                    value={formLinkYoutube.video_url}
                    onChange={handleInputChangeUrl}
                    style={{ height: "45px" }}
                  />
                </div>
                <div
                  className="ms-3 d-flex flex-column mt-5 pb-3"
                  style={{ width: "95%" }}
                >
                  <button
                    type="button"
                    className="btn btn-success align-self-end"
                    style={{ width: "auto" }}
                    onClick={saveYoutubeLink}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </TabPanel>
          </TabContext>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
      {/* Upload Link */}
      <Modal
        open={openUploadLink}
        onClose={handleCloseUploadLink}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Salvar Link" />
            <FontAwesomeIcon
              icon={faX}
              color="white"
              size="xl"
              style={{ cursor: "pointer" }}
              onClick={handleCloseUploadLink}
            />
          </div>
          <hr />
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="d-flex flex-column mt-5 gap-3" style={{width: '50%'}}>
              <label htmlFor="input-link" className="ms-3" style={{color: 'white', fontSize: '20px', marginTop:'14px'}}>Link</label>
              <input
                id="input-link"
                type="text"
                name="url"
                className="form-control input-create bg-dark-custom"
                value={linkFormData.url}
                onChange={handleInputFormData}
              />

              <label htmlFor="input-descricao" className="ms-3" style={{color: 'white', fontSize: '20px', marginTop:'14px'}}>Descrição</label>
              <input
                id="input-descricao"
                type="text"
                name="descricao"
                value={linkFormData.descricao}
                className="form-control input-create bg-dark-custom"
                onChange={handleInputFormData}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <div
              className="ms-3 d-flex flex-column mt-5 pb-3"
              style={{ width: "95%" }}
            >
              <button
                type="button"
                className="btn btn-success align-self-end"
                style={{ width: "auto" }}
                onClick={handleSalvarLink}
                disabled={!isFormValid}
              >
                Salvar
              </button>
            </div>
          </div>
          {isLoading ? (
            <div
              className={`d-flex justify-content-center align-items-center w-100 min-vh-100 position-absolute top-0 left-0 ${styles2.overlay}`}
            >
              <Loading
                type="bars"
                color="var(--bg-ternary-color)"
                width={100}
              />
            </div>
          ) : null}
        </Box>
      </Modal>
    </div>
  );
};
