import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Header() {
  return (
    <>
    <div className="d-flex justify-content-between align-items-center m-3">
      <Image
      className="me-auto p-2"
      src="/images/logo-fort-house.png"
      width={105}
      height={75}
      alt="company logo"
      />

      <Image
      className="p-2 me-3"
      src="/images/logo-arabe.png"
      width={78}
      height={78}
      alt="company logo"
      />

      <FontAwesomeIcon 
      className="p-2"
      icon={faBars} 
      size="2xl"
      style={{color: "var(--color-line)", cursor: 'pointer'}} 
      />
    </div>
    <hr />
    </>
  )
}