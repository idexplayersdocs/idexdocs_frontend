import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router"

export default function AthleteDetail() {
  const { query, push, back } = useRouter();

  const athleteId = query?.id;

  return (
    <>
    <Header />
      <div className="row justify-content-start" >
        <div className="col-2">
          <SideBar />
        </div>
        <div className="col-10">
          <div className="card h-100" style={{backgroundColor: 'var(--bg-secondary-color)'}}>
            <div className="main">
              <p style={{color: 'white'}}>
              <FontAwesomeIcon icon={faMugSaucer} style={{color: 'white'}} />
              Aqui vai o detalhe do Atleta
              </p>
            </div>


          </div>
        </div>
      </div>
    </>
  )
}