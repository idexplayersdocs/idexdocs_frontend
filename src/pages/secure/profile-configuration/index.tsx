import Header from "@/components/Header";
import { Pagination, TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UsuarioRequestDTO, UsuarioResponseDTO } from "@/pages/api/http-service/usuarioService/dto";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CriarUsuario, Usuarios } from "@/pages/api/http-service/usuarioService";
import { SnackBar } from "@/components/SnackBar";
import { LoadingOverlay } from "@/components/LoadingOverley";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    handleSubmit: handleSubmitCreateUser,
    register: registerCreateUser,
    reset: resetCreateUser,
    formState: { errors: errosUserCreate },
  } = useForm<UsuarioRequestDTO>();

  const onSubmitCreateUser = async (data: UsuarioRequestDTO): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await CriarUsuario(data);
      setShowSnackbar(true);
      resetCreateUser();
    } catch (e: unknown) {
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
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

  const onUpdateUser = async (): Promise<void> => {
    console.log("Atualizar");
  };

  React.useEffect(() => {
    (async () => {
      await getListUser(1, 10);
    })();
  }, []);

  return (
    <>
      <Header />
      <LoadingOverlay isLoading={loading} />
      <div className="w-75 mx-auto">
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
            TabIndicatorProps={{
              style: {
                backgroundColor: "#626262",
              },
            }}
          >
            <StyledTab label="Editar Perfil" value="1" />
            <StyledTab label="Criar Usuários" value="2" />
            <StyledTab label="Editar Usuários" value="3" />
          </TabList>
          <TabPanel value="1">
            <div className="w-75 mx-auto mt-5">
              <form>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input type="text" className="form-control input-create bg-dark" />
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Email:</label>
                  <input type="text" className="form-control input-create bg-dark" />
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Senha:</label>
                  <input type="password" className="form-control input-create bg-dark" />
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
            <div className="w-75 mx-auto mt-5">
              <form onSubmit={handleSubmitCreateUser(onSubmitCreateUser)}>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input
                    type="text"
                    className="form-control input-create bg-dark"
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
                    className="form-control input-create bg-dark"
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
                    className="form-control input-create bg-dark"
                    {...registerCreateUser("password", {
                      required: true,
                    })}
                  />
                  {errosUserCreate.email && <span className="text-danger mt-1 d-block">Senha is required field</span>}
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Tipo de usuário:</label>
                  <select
                    className="form-control input-create bg-dark"
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
                          onClick={() => onUpdateUser()}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "white", cursor: "pointer" }}
                          size="xl"
                          onClick={() => onDeleteUser()}
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
            {usuarioList && usuarioList.total > 10 && (
              <Pagination
                className="pagination-bar"
                count={Math.ceil(usuarioList!.total / 10)}
                page={page}
                onChange={() => {}}
                variant="outlined"
                size="large"
              />
            )}
          </TabPanel>
        </TabContext>
        {showSnackBar && <SnackBar msg="Usuário criado com sucesso!" open={true} type="success" />}
      </div>
    </>
  );
}
