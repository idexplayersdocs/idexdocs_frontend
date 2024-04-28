import Relationship from "@/components/Relationship";
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
          {/* Relacionamento */}
          <div className="card h-100" style={{backgroundColor: 'var(--bg-secondary-color)', marginRight:'10px'}}>
              <Relationship />
          </div>
        </div>
      </div>
    </>
  )
}