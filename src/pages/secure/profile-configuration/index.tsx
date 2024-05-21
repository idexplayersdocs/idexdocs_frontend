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
import { Controller, useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CriarUsuario, UpdatePassword, UpdateUsuario, Usuarios } from "@/pages/api/http-service/usuarioService";
import { SnackBar } from "@/components/SnackBar";
import { LoadingOverlay } from "@/components/LoadingOverley";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash, faX, faSpinner, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Checkbox, Modal, colors } from "@mui/material";
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
  const [role, setRole] = React.useState<string>("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    handleSubmit: handleSubmitCreateUser,
    register: registerCreateUser,
    reset: resetCreateUser,
    formState: { errors: errosUserCreate },
    control: controlCreateUser,
    setValue: setValueCreateUser,
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
      if(res){
        setShowSnackbar(true);
        setMessageSnackBar("Usuário criado com sucesso!");
        resetCreateUser();
        setPage(1)
        const res = await Usuarios(1, 10);
        setUsuarioLilst(res);
      }
    } catch (e: unknown) {
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  const onSubmitUpdateUser = async (data: UsuarioUpdateRequestDTO): Promise<void> => {
    console.log(data);
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

      const res = await UpdatePassword({ id: data.id, password: data.confirmarSenha, new_password: data.senha });
      const resUpdateUser = await UpdateUsuario({
        email: data.email,
        id: data.id,
        nome: data.nome,
        usuario_tipo_id: tipo,
        create_desempenho: false,
        create_relacionamento: false,
      });

      // console.log(resUpdateUser);
    } catch (e) {
      setMessageSnackBar("Senha atual inválida. Tente novamente!");
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

    if (usuario.permissoes) {
      setValueModal("create_desempenho", usuario.permissoes.create_relacionamento);
      setValueModal("create_relacionamento", usuario.permissoes.create_relacionamento);
    }

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

    setValueUpdateProfile("nome", decoded.user_name);
    setValueUpdateProfile("email", decoded.sub);
    setValueUpdateProfile("id", decoded.user_id);
    setValueUpdateProfile("tipo", decoded.roles[0]);

    setRole(decoded.roles[0]);

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
            <StyledTab className="col" label="Editar Perfil" value="1" />
            {role === "admin" ? <StyledTab className="col" label="Criar Usuários" value="2" /> : null}
            {role === "admin" ? <StyledTab className="col" label="Editar Usuários" value="3" /> : null}
          </TabList>
          <TabPanel value="1">
            <div className="w-100 mx-auto mt-5 px-2">
              <form onSubmit={handleSubmitUpdateProfile(onUpdatePerfil)}>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark-custom"
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
                    className="form-control input-create bg-dark-custom"
                    {...registerUpdateProfile("email", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.email && <span className="text-danger mt-1 d-block">Email is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Senha Atual:</label>
                  <input
                    type="password"
                    className="form-control input-create bg-dark-custom"
                    {...registerUpdateProfile("confirmarSenha", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.confirmarSenha && (
                    <span className="text-danger mt-1 d-block">Senha is required field</span>
                  )}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Nova Senha:</label>
                  <input
                    type="password"
                    className="form-control input-create bg-dark-custom"
                    {...registerUpdateProfile("senha", {
                      required: true,
                    })}
                  />
                  {errosUpdateProfile.senha && <span className="text-danger mt-1 d-block">Senha is required field</span>}
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-end">
                  <button className="btn-success btn text-white" type="submit">
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
                    <option value="1">Administrativo</option>
                    <option value="2">Treinador</option>
                    <option value="3">Externo</option>
                  </select>
                  {errosUserCreate.usuario_tipo_id && (
                    <span className="text-danger mt-1 d-block">Tipo de usuário is required field</span>
                  )}
                </div>
                <div className="mt-4 d-flex align-items-center">
                  <Checkbox
                    color="success"
                    name="clube_atual"
                    onChange={(e) => setValueCreateUser("create_relacionamento", e.target.checked)}
                    // checked={formRegisterClub.clube_atual}
                    sx={{
                      color: "var(--bg-ternary-color)",
                      "&.Mui-checked": {
                        color: "var(--bg-ternary-color)",
                      },
                    }}
                  />
                  <p className="text-white mb-0">Acesso a tela de relacionamento</p>
                </div>
                <div className="mt-1 d-flex align-items-center">
                  <Checkbox
                    color="success"
                    onChange={(e) => setValueCreateUser("create_desempenho", e.target.checked)}
                    name="clube_atual"
                    sx={{
                      color: "var(--bg-ternary-color)",
                      "&.Mui-checked": {
                        color: "var(--bg-ternary-color)",
                      },
                    }}
                  />

                  <p className="text-white mb-0">Acesso a tela de desempenho</p>
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-end">
                  <button className="btn-success btn text-white" type="submit">
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
                    <th className="table-dark text-center" scope="col">
                      NOME
                    </th>
                    <th className="table-dark text-center" scope="col">
                      EMAIL
                    </th>
                    <th className="table-dark text-center" scope="col">
                      DATA DE CRIAÇÃO
                    </th>
                    <th className="table-dark text-center" scope="col">
                      TIPO
                    </th>
                    <th className="table-dark text-center" scope="col">
                      DESEMPENHO
                    </th>
                    <th className="table-dark text-center" scope="col">
                      RELACIONAMENTO
                    </th>
                    <th className="table-dark text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarioList?.data ? (
                    usuarioList.data.map((user, i) => (
                      <tr key={i}>
                        <td className="table-dark text-center">{user.nome}</td>
                        <td className="table-dark text-center">{user.email}</td>
                        <td className="table-dark text-center">{new Date(user.data_criacao).toLocaleDateString()}</td>
                        <td className="table-dark text-center">{user.tipo}</td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon
                            icon={user.permissoes?.create_desempenho ? faCheck : faXmark}
                            size="xl"
                            style={user.permissoes?.create_desempenho ? { color: "#15ff00" } : { color: "#ff0000" }}
                          />
                        </td>
                        <td className="table-dark text-center">
                          <FontAwesomeIcon
                            icon={user.permissoes?.create_relacionamento ? faCheck : faXmark}
                            size="xl"
                            style={user.permissoes?.create_relacionamento ? { color: "#15ff00" } : { color: "#ff0000" }}
                          />
                        </td>
                        <td className="table-dark text-center">
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
                      <td colSpan={6} className="table-dark text-center">
                        Lista de usuários vazia
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
          <div
            className="rounded p-3 pt-3 "
            style={{ maxWidth: "900px", backgroundColor: "#3c3c3c", width: "95%", height: "95%", overflow: "auto" }}
          >
            <div className="d-flex justify-content-between mb-5">
              <Subtitle subtitle="Edição de usuário" />
              <FontAwesomeIcon
                icon={faX}
                style={{ color: "#ffffff", cursor: "pointer" }}
                size="xl"
                onClick={handleCloseUpdateModal}
              />
            </div>
            <hr style={{ marginTop: "-25px" }} />
            <form onSubmit={handleSubmitUpdateUser(onSubmitUpdateUser)} style={{ marginLeft: "15px" }}>
              <div className="mb-4">
                <label className="d-block text-white h4">Nome:</label>
                <input
                  type="text"
                  className="form-control input-create bg-dark bg-dark-custom"
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
                  className="form-control input-create bg-dark bg-dark-custom"
                  {...registerUpdateUser("email", {
                    required: true,
                  })}
                />
                {errorsUserUpdate.email && <span className="text-danger mt-1 d-block">Email is required field</span>}
              </div>
              <div className="mb-4">
                <label className="d-block text-white h4">Tipo de usuário:</label>
                <select
                  className="form-control input-create bg-dark bg-dark-custom"
                  defaultValue=""
                  {...registerUpdateUser("usuario_tipo_id", { required: true })}
                >
                  <option value="1">Administrativo</option>
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
                  <p className="mb-0">Atualizar</p>
                  {updateUserLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : null}
                </button>
              </div>
              <div className="mt-4 d-flex align-items-center">
                <Checkbox
                  color="success"
                  name="clube_atual"
                  onChange={(e) => setValueModal("create_relacionamento", e.target.checked)}
                  checked={getValueModal("create_relacionamento")}
                  sx={{
                    color: "var(--bg-ternary-color)",
                    "&.Mui-checked": {
                      color: "var(--bg-ternary-color)",
                    },
                  }}
                />
                <p className="text-white mb-0">Acesso a tela de relacionamento</p>
              </div>
              <div className="mt-1 d-flex align-items-center">
                <Checkbox
                  color="success"
                  onChange={(e) => setValueModal("create_desempenho", e.target.checked)}
                  name="clube_atual"
                  checked={getValueModal("create_desempenho")}
                  sx={{
                    color: "var(--bg-ternary-color)",
                    "&.Mui-checked": {
                      color: "var(--bg-ternary-color)",
                    },
                  }}
                />

                <p className="text-white mb-0">Acesso a tela de desempenho</p>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
