import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddButton() {
  return (
      <button type="button" className="btn btn-success" style={{width:'auto'}}>
              <FontAwesomeIcon icon={faPlus} size='2xl'/>
      </button>
  )
}