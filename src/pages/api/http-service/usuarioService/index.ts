import { axiosClient } from "../../axiosClient";
import { UsuarioRequestDTO } from "./dto";

export const CriarUsuario = async ({ email, nome, password, usuario_tipo_id }: UsuarioRequestDTO) => {
  const { data } = await axiosClient.post("/usuario/create", {
    nome,
    password,
    email,
    usuario_tipo_id,
  });

  return data;
};
