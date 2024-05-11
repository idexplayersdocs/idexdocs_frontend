import { axiosClient } from "../../axiosClient";
import { UsuarioRequestDTO, UsuarioResponseDTO } from "./dto";
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
