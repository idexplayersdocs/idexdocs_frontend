import Relationship from "@/components/Relationship";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { getAthleteById } from "@/lib/http-service/athletes";
import type { AthleteDetail as AthleteDetailType } from '@/types';

export default function AthleteDetail() {
  const { query, push, back } = useRouter();
  const [athlete, setAthlete] = useState<AthleteDetailType>();

  const athleteId = query?.id as string;

  
  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athleteData = await getAthleteById(athleteId);
        setAthlete(athleteData?.data as AthleteDetailType);
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
          <SideBar athleteData={athlete!}  modal={false}/>
        </div>
        <div className="col-10">
          <div className="card h-100" style={{backgroundColor: 'var(--bg-secondary-color)', marginRight:'10px'}}>
              <Relationship />
          </div>
        </div>
      </div>
    </>
  )
}
