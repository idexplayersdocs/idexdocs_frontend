import { axiosClient } from "../../axiosClient";
import { LoginRequestDTO, LoginResponseDTO } from "./dto";

export const LoginUser = async (login: LoginRequestDTO): Promise<LoginResponseDTO> => {
  const { data } = await axiosClient.post<LoginResponseDTO>("/auth/token", {
    email: login.email,
    password: login.password,
  });

  return data;
};
