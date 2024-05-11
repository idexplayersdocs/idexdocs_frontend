import { axiosClient } from "../../axiosClient"
import { PDFInfoResponseDTO } from "./dto";

export const PDFInfo = async (id: number): Promise<PDFInfoResponseDTO> => {
    const {data} = await axiosClient.get<PDFInfoResponseDTO>(`/create/pdf/atleta/${id}`);
    return data;
}