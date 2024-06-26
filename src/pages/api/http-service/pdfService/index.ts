import { axiosClient } from "../../axiosClient"
import { PDFInfoResponseDTO } from "./dto";

export const PDFInfo = async (id: number, permissions: any): Promise<PDFInfoResponseDTO> => {
    let url = `/create/pdf/atleta/${id}`
    if (permissions.relationship || permissions.performance) {
        const consultas = [];
        if (permissions.relationship) consultas.push('create_relacionamento');
        if (permissions.performance) consultas.push('create_desempenho');
        url += `?permissoes=[${consultas.join(',')}]`;
    }
    console.log(url)
    const {data} = await axiosClient.get<PDFInfoResponseDTO>(url);
    return data;
}