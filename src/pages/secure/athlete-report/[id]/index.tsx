import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import MyDocumentReport from "@/components/DocumentReport";
import { jwtDecode } from "jwt-decode";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

type Permissions = {
  relationship: boolean;
  performance: boolean;
};

export default function AthleteReport() {
  const { query } = useRouter();
  const [infoPdf, setInfoPdf] = useState<PDFInfoResponseDTO | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);

  const athleteId = query?.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    if (token) {
      setPermissions({
        relationship: decoded.permissions.includes("create_relacionamento"),
        performance: decoded.permissions.includes("create_desempenho"),
      });
    } else {
      setPermissions({
        relationship: false,
        performance: false,
      });
    }
  }, []);

  useEffect(() => {
    // get PDF info
    const fetchPdfInfo = async (id: number) => {
      try {
        const pdfInfo = await PDFInfo(id, permissions);
        setInfoPdf(pdfInfo);
      } catch (error) {
        console.error("Error fetching PDF info:", error);
      }
    };

    if (athleteId && permissions) {
      const decoded = atob(`${athleteId as string}`).split("-YKhZPhhZ*TKAJ")[0];

      fetchPdfInfo(parseInt(decoded));
    }
  }, [athleteId, permissions]);

  return (
    <I18nextProvider i18n={i18n}>
      {infoPdf && <MyDocumentReport data={infoPdf} />}
    </I18nextProvider>
  );
}
