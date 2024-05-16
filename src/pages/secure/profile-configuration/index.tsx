import Header from "@/components/Header";
import { Pagination, TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  Usuario,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  UsuarioUpdateRequestDTO,
} from "@/pages/api/http-service/usuarioService/dto";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CriarUsuario, UpdatePassword, UpdateUsuario, Usuarios } from "@/pages/api/http-service/usuarioService";
import { SnackBar } from "@/components/SnackBar";
import { LoadingOverlay } from "@/components/LoadingOverley";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash, faX, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Modal, colors } from "@mui/material";
import Subtitle from "@/components/Subtitle";
import { jwtDecode } from "jwt-decode";

const StyledTab = styled(Tab)({
  color: "#626262",
  "&.Mui-selected": {
    color: "#ff781d",
  },
});

export default function ProfileConfiguration() {
  const [tabValue, setTabValue] = React.useState<string>("1");
  const [page, setPage] = React.useState<number>(1);
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);
  const [usuarioList, setUsuarioLilst] = React.useState<UsuarioResponseDTO>();
  const [openModalUpdate, setOpenModalUpdate] = React.useState<boolean>(false);
  const [updateUserLoading, setUpdateUserLoading] = React.useState<boolean>(false);
  const [messageSnackBar, setMessageSnackBar] = React.useState<string>("");
  const [showSnackBarError, setSnackBarError] = React.useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    handleSubmit: handleSubmitCreateUser,
    register: registerCreateUser,
    reset: resetCreateUser,
    formState: { errors: errosUserCreate },
  } = useForm<UsuarioRequestDTO>();

  const {
    handleSubmit: handleSubmitUpdateUser,
    register: registerUpdateUser,
    reset: resetUpdateUser,
    formState: { errors: errorsUserUpdate },
    setValue: setValueModal,
    getValues: getValueModal,
  } = useForm<UsuarioUpdateRequestDTO>();

  const {
    register: registerUpdateProfile,
    setValue: setValueUpdateProfile,
    handleSubmit: handleSubmitUpdateProfile,
    formState: { errors: errosUpdateProfile },
  } = useForm<{ id: number; nome: string; email: string; senha: string; confirmarSenha: string; tipo: string }>();

  const onSubmitCreateUser = async (data: UsuarioRequestDTO): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await CriarUsuario(data);
      setShowSnackbar(true);
      setMessageSnackBar("Usuário criado com sucesso!");
      resetCreateUser();
    } catch (e: unknown) {
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  const onSubmitUpdateUser = async (data: UsuarioUpdateRequestDTO): Promise<void> => {
    setUpdateUserLoading(true);
    try {
      const res = await UpdateUsuario(data);
      setMessageSnackBar("Usuário Atualizado com sucesso!");
      setShowSnackbar(true);

      const newListUser = usuarioList;
      const userModify = newListUser!.data.find((x) => x.id === data.id);
      userModify!.nome = data.nome;
      userModify!.email = data.email;

      if (data.usuario_tipo_id === "1") {
        userModify!.tipo = "admin";
      }

      if (data.usuario_tipo_id === "2") {
        userModify!.tipo = "treinador";
      }

      if (data.usuario_tipo_id === "3") {
        userModify!.tipo = "externo";
      }

      setUsuarioLilst({ count: usuarioList!.count, total: usuarioList!.total, data: newListUser!.data! });
    } catch (e: unknown) {
      console.log(e);
    } finally {
      setUpdateUserLoading(false);
    }

    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  const onUpdatePerfil = async (data: any) => {
    setIsLoading(true);
    try {
      let tipo = "0";

      if (data.tipo === "admin") {
        tipo = "1";
      }

      if (data.tipo === "treinador") {
        tipo = "2";
      }

      if (data.tipo === "externo") {
        tipo = "3";
      }

      console.log(data);

      const res = await UpdatePassword({ id: data.id, password: data.confirmarSenha, new_password: data.senha });
      const resUpdateUser = await UpdateUsuario({
        email: data.email,
        id: data.id,
        nome: data.nome,
        usuario_tipo_id: tipo,
      });

      // console.log(resUpdateUser);
    } catch (e) {
      setMessageSnackBar("Senha anterior inválida. Tente novamente!");
      setSnackBarError(true);
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setSnackBarError(false);
    }, 5000);
  };

  const getListUser = async (page: number, perPage: number): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await Usuarios(page, perPage);
      setUsuarioLilst(res);
      console.log(res);
    } catch (e: unknown) {
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteUser = async (): Promise<void> => {
    console.log("DELETAR");
  };

  const handleCloseUpdateModal = () => {
    setOpenModalUpdate(false);
  };

  const onUpdateUser = async (usuario: Usuario): Promise<void> => {
    setValueModal("nome", usuario.nome);
    setValueModal("email", usuario.email);

    switch (usuario.tipo) {
      case "admin":
        setValueModal("usuario_tipo_id", "1");
        break;
      case "treinador":
        setValueModal("usuario_tipo_id", "2");
        break;
      case "externo":
        setValueModal("usuario_tipo_id", "3");
        break;
    }
    setValueModal("id", usuario.id);
    setOpenModalUpdate(true);
  };

  const setDataUser = (): void => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);

    setValueUpdateProfile("nome", decoded.sub);
    setValueUpdateProfile("email", decoded.user_name);
    setValueUpdateProfile("id", decoded.user_id);
    setValueUpdateProfile("tipo", decoded.roles[0]);
  };

  const handleChangePage = async (event: any, page: number): Promise<void> => {
    await getListUser(page, 10);
  };

  React.useEffect(() => {
    (async () => {
      await getListUser(1, 10);
    })();

    setDataUser();
  }, []);

  return (
    <>
      <Header />
      <LoadingOverlay isLoading={loading} />
      <div className="w-100 mx-auto px-4">
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
            TabIndicatorProps={{
              style: {
                backgroundColor: "#626262",
                paddingLeft: '5px',
                paddingRight: '5px'
              },
            }}
          >
            <StyledTab label="Editar Perfil" value="1" />
            <StyledTab label="Criar Usuários" value="2" />
            <StyledTab label="Editar Usuários" value="3" />
          </TabList>
          <TabPanel value="1">
            <div className="w-100 mx-auto mt-5 px-2">
              <form onSubmit={handleSubmitUpdateProfile(onUpdatePerfil)}>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark"
                    {...registerUpdateProfile("nome", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.nome && <span className="text-danger mt-1 d-block">Nome is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Email:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark"
                    {...registerUpdateProfile("email", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.email && <span className="text-danger mt-1 d-block">Nome is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Senha Anterior:</label>
                  <input
                    type="password"
                    className="form-control input-create bg-dark"
                    {...registerUpdateProfile("confirmarSenha", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.confirmarSenha && (
                    <span className="text-danger mt-1 d-block">Nome is required field</span>
                  )}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Nova Senha:</label>
                  <input
                    type="password"
                    className="form-control input-create bg-dark"
                    {...registerUpdateProfile("senha", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.senha && <span className="text-danger mt-1 d-block">Nome is required field</span>}
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-end">
                  <button className="btn-success btn text-white w-25" type="submit">
                    Atualizar
                  </button>
                </div>
              </form>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="w-100 mx-auto mt-5">
              <form onSubmit={handleSubmitCreateUser(onSubmitCreateUser)}>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark-custom "
                    {...registerCreateUser("nome", {
                      required: true,
                    })}
                  />
                  {errosUserCreate.nome && <span className="text-danger mt-1 d-block">Nome is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Email:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark-custom "
                    {...registerCreateUser("email", {
                      required: true,
                    })}
                  />
                  {errosUserCreate.email && <span className="text-danger mt-1 d-block">Email is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Senha:</label>
                  <input
                    type="password"
                    className="form-control input-create bg-dark-custom "
                    {...registerCreateUser("password", {
                      required: true,
                    })}
                  />
                  {errosUserCreate.email && <span className="text-danger mt-1 d-block">Senha is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Tipo de usuário:</label>
                  <select
                    className="form-control input-create bg-dark-custom "
                    {...registerCreateUser("usuario_tipo_id", {
                      required: true,
                    })}
                  >
                    <option value="1">ADMIN</option>
                    <option value="2">Treinador</option>
                    <option value="3">Externo</option>
                  </select>
                  {errosUserCreate.usuario_tipo_id && (
                    <span className="text-danger mt-1 d-block">Tipo de usuário is required field</span>
                  )}
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-end">
                  <button className="btn-success btn text-white w-25" type="submit">
                    Criar
                  </button>
                </div>
              </form>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div className="overflow-x-auto">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="table-dark" scope="col">
                      NOME
                    </th>
                    <th className="table-dark" scope="col">
                      EMAIL
                    </th>
                    <th className="table-dark" scope="col">
                      DATA DE CRIAÇÃO
                    </th>
                    <th className="table-dark" scope="col">
                      TIPO
                    </th>
                    <th className="table-dark"></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarioList?.data ? (
                    usuarioList.data.map((user, i) => (
                      <tr key={i}>
                        <td className="table-dark">{user.nome}</td>
                        <td className="table-dark">{user.email}</td>
                        <td className="table-dark">{new Date(user.data_criacao).toLocaleDateString()}</td>
                        <td className="table-dark">{user.tipo}</td>
                        <td className="table-dark">
                          <FontAwesomeIcon
                            icon={faPenSquare}
                            style={{ color: "white", cursor: "pointer", marginRight: 12 }}
                            size="xl"
                            onClick={() => onUpdateUser(user)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="table-dark text-center">
                        Lista de atletas vazia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
           
          </TabPanel>
        </TabContext>
        {showSnackBar && <SnackBar msg={messageSnackBar} open={true} type="success" />}
        {showSnackBarError && <SnackBar msg={messageSnackBar} open={true} type="error" />}
      </div>
      <Modal open={openModalUpdate} onClose={handleCloseUpdateModal}>
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
          <div className="rounded w-100 p-5 " style={{ maxWidth: "900px", backgroundColor: "#3c3c3c" }}>
            <div className="d-flex justify-content-between mb-5">
              <Subtitle subtitle="Edição de usuário" />
              <FontAwesomeIcon
                icon={faX}
                style={{ color: "#ffffff", cursor: "pointer" }}
                size="xl"
                onClick={handleCloseUpdateModal}
              />
            </div>
            <form onSubmit={handleSubmitUpdateUser(onSubmitUpdateUser)} style={{ marginLeft: "15px" }}>
              <div className="mb-4">
                <label className="d-block text-white h4">Nome:</label>
                <input
                  type="text"
                  className="form-control input-create bg-dark"
                  {...registerUpdateUser("nome", {
                    required: true,
                  })}
                />
                {errorsUserUpdate.nome && <span className="text-danger mt-1 d-block">Nome is required field</span>}
              </div>
              <div className="mb-4">
                <label className="d-block text-white h4">Email:</label>
                <input
                  type="text"
                  className="form-control input-create bg-dark"
                  {...registerUpdateUser("email", {
                    required: true,
                  })}
                />
                {errorsUserUpdate.email && <span className="text-danger mt-1 d-block">Nome is required field</span>}
              </div>
              <div className="mb-4">
                <label className="d-block text-white h4">Tipo de usuário:</label>
                <select
                  className="form-control input-create bg-dark"
                  defaultValue=""
                  {...registerUpdateUser("usuario_tipo_id", { required: true })}
                >
                  <option value="1">ADMIN</option>
                  <option value="2">Treinador</option>
                  <option value="3">Externo</option>
                </select>
                {errorsUserUpdate.usuario_tipo_id && (
                  <span className="text-danger mt-1 d-block">Nome is required field</span>
                )}
              </div>
              <div className="mt-4 d-flex align-items-center justify-content-end">
                <button
                  disabled={updateUserLoading}
                  className="btn-success btn text-white w-25 d-flex align-items-center justify-content-center"
                  type="submit"
                >
                  <p className="mb-0 me-2">Atualizar</p>
                  {updateUserLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
