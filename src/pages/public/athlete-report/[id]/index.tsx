import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PDFInfo } from "@/pages/api/http-service/pdfService";
import { PDFInfoResponseDTO } from "@/pages/api/http-service/pdfService/dto";
import MyDocumentReport from "@/components/DocumentReport";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export default function AthleteReport() {
  const { query } = useRouter();
  const [infoPdf, setInfoPdf] = useState<PDFInfoResponseDTO | null>(null);

  const athleteId = query?.id;

  useEffect(() => {
    // get PDF info
    const fetchPdfInfo = async (id: number) => {
      try {
        const pdfInfo = await PDFInfo(id, {
          relationship: true,
          performance: true,
        });
        setInfoPdf(pdfInfo);
      } catch (error) {
        console.error("Error fetching PDF info:", error);
      }
    };

    if (athleteId) {
      const decoded = atob(`${athleteId as string}`).split("-YKhZPhhZ*TKAJ")[0];

      fetchPdfInfo(parseInt(decoded));
    }
  }, [athleteId]);

  return (
    <I18nextProvider i18n={i18n}>
      {infoPdf && <MyDocumentReport data={infoPdf} />}
    </I18nextProvider>
  );
}
