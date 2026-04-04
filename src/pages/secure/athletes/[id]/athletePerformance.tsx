
import React, { useEffect, useState } from 'react';
import dataRalationship from '@/lib/mock-data/mock-data-relationship-list.json'
import dataSupportControl from '@/lib/mock-data/mock-data-support-control.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useRouter } from 'next/router';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import Performance from '@/components/Performance';
import { getAthleteById } from '@/lib/http-service/athletes';
import type { AthleteDetail } from '@/types';

export default function AthletePerformance() {
  const { query, push, back } = useRouter();
  const [athlete, setAthlete] = useState<AthleteDetail>();

  const athleteId = query?.id as string;


  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athleteData = await getAthleteById(athleteId);
        setAthlete(athleteData?.data as AthleteDetail);
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
          <SideBar athleteData={athlete!}  modal={false} />
        </div>
        <div className="col-10">
        <ul className="nav nav-tabs">
          <li className="nav-item me-1">
            <a className="nav-link" aria-current="page" href={`/secure/athletes/${athleteId}/athleteRelationship`}>Relacionamento</a>
          </li>
          <li className="nav-item">
          <a className="nav-link active" aria-current="page" href={`/secure/athletes/${athleteId}/athletePerformance`}>Desempenho</a>
          </li>
        </ul>
          <div className="card athlete-detail-card" style={{backgroundColor: 'var(--bg-secondary-color)', marginRight:'10px'}}>
              {/* <Performance athleteData={athlete} /> */}
          </div>
        </div>
      </div>
    </>
  )
}
