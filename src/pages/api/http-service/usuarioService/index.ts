import { axiosClient } from "../../axiosClient";
import { UsuarioRequestDTO, UsuarioResponseDTO, UsuarioUpdateRequestDTO } from "./dto";
import queryString from "query-string";

export const CriarUsuario = async ({ email, nome, password, usuario_tipo_id }: UsuarioRequestDTO) => {
  const { data } = await axiosClient.post("/usuario/create", {
    nome,
    password,
    email,
    usuario_tipo_id,
  });

  return data;
};

export const Usuarios = async (page: number, perPage: number): Promise<UsuarioResponseDTO> => {
  const queryStringParams = queryString.stringify({ page, perPage });

  const { data } = await axiosClient.get<UsuarioResponseDTO>(`/usuarios?${queryStringParams}`);

  return data;
};

export const UpdateUsuario = async (usuario: UsuarioUpdateRequestDTO) => {
  const { data } = await axiosClient.put(`/usuario/update`, {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    usuario_tipo_id: usuario.usuario_tipo_id,
  });

  return data;
};


export const UpdatePassword = async (usuario: {id: number; password: string; new_password: string}) => {
  const {data} = await axiosClient.put(`/usuario/update/password`, {
    id: usuario.id,
    password: usuario.password,
    new_password: usuario.new_password
  });

  return data;
}