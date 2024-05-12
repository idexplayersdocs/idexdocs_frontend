import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Search() {
  const[formFilterAthlete, setFormFilterAthlete] = useState<string>()
  
  return (
    <>
      <div className="input-group w-50">
        <input type="text" className="form-control bg-dark" placeholder="Search" aria-label="Search" aria-describedby="inputSearch"/>
        <span className="input-group-text d-flex justify-content-center" id="inputSearch">
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg"/>
        </span>
      </div>
    </>
  )
}