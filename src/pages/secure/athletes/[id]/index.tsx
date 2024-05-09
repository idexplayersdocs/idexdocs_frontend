import Relationship from "@/components/Relationship";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { getAthleteById } from "@/pages/api/http-service/athletes";

export default function AthleteDetail() {
  const { query, push, back } = useRouter();
  const [athlete, setAthlete] = useState<any>();

  const athleteId = query?.id;

  
  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athleteData = await getAthleteById(athleteId);
        setAthlete(athleteData.data);
      } catch (error) {
        console.error('Error fetching athletes:', error);
      }
    };

    fetchAthletesData();
  }, [athleteId]);

  return (
    <>
    <Header />
      <div className="row justify-content-start" >
        <div className="col-2">
          <SideBar athleteData={athlete} />
        </div>
        <div className="col-10">
          {/* Relacionamento */}
          <div className="card h-100" style={{backgroundColor: 'var(--bg-secondary-color)', marginRight:'10px'}}>
              <Relationship />
          </div>
        </div>
      </div>
    </>
  )
}