import { faBars, faHouse, faRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Dropdown from 'react-bootstrap/Dropdown';
import React from "react";


import { jwtDecode } from "jwt-decode";
import i18n from "@/i18n";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [decoded, setDecoded] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  // const token: any = localStorage.getItem("token");
  // const decoded: any = jwtDecode(token!);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      }
    }
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const onClickLogout = (): void => {
    setAnchorEl(null);
    localStorage.removeItem("token");
    router.push("/public/login");
  }
  const onClickHome = (): void => {
    router.push("/secure/athletes");
  }

  const onClickConfiguration = (): void => {
    setAnchorEl(null);
    router.push("/secure/profile-configuration");
  }

  return (
    <>
      <div className="mt-4 text-center">
        <h2 style={{ color: 'white', fontSize: '20px' }}>Olá! <span style={{ color: "var(--bg-ternary-color)" }}>{decoded?.user_name}</span></h2>
        <select style={{ background: 'none', border: "none", fontSize: "1.5rem", color: 'white', outline: 'none' }} onChange={(e) => i18n.changeLanguage(e.target.value)} defaultValue={i18n.language}>
          <option value="pt">🇧🇷</option>
          <option value="en">🇺🇸</option>
          <option value="es">🇪🇸</option>
        </select>
      </div>
      <div className="d-flex justify-content-between align-items-center m-3">
        <div className="p-2">
          <Image src="/images/logo-fort-house.png" width={118} height={78} alt="company logo" />
        </div>
        <div className="w-100 justify-content-evenly nav-bar-custom">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="nav-custom">
              <div className="icon-menu">
                <div className="icon-menu-content d-flex">
                  <FontAwesomeIcon icon={faHouse} size="lg" color="white" className="icon-menu" style={{ marginTop: '1px', marginRight: '10px' }} />
                  <h2 style={{ color: 'white', fontSize: '22px' }}>Home</h2>
                </div>
              </div>
            </div>
          </Link>
          <div className="nav-custom">
            <div className="icon-menu">
              <div className="icon-menu-content d-flex" onClick={() => onClickConfiguration()}>
                <FontAwesomeIcon icon={faGear} size="lg" color="white" className="icon-menu" style={{ marginTop: '1px', marginRight: '10px' }} />
                <h2 style={{ color: 'white', fontSize: '20px' }}>Configuração</h2>
              </div>
            </div>
          </div>
          <div className="nav-custom">
            <div className="icon-menu">
              <div className="icon-menu-content d-flex" onClick={() => onClickLogout()}>
                <FontAwesomeIcon icon={faRightFromBracket} size="lg" color="white" className="icon-menu" style={{ marginTop: '1px', marginRight: '10px' }} />
                <h2 style={{ color: 'white', fontSize: '20px' }}>Sair</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="p-2 me-3">
            <Image src="/images/logo-arabe.png" width={78} height={78} alt="company logo" />
          </div>
          <Dropdown className="container-menu-nav" align={{ lg: 'start' }}
          >
            <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: 'var(--bg-primary-color)' }}>
              <FontAwesomeIcon icon={faBars} size="2xl" style={{ color: "var(--bg-ternary-color)", cursor: "pointer" }} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ backgroundColor: 'var(--bg-secondary-color)' }}>
              <Dropdown.Item onClick={() => onClickHome()} className="menu-item">
                <p className="mb-1 menu-item-text" style={{ color: 'white' }}> Home
                  <FontAwesomeIcon icon={faHouse} className="ms-2" />
                </p>
              </Dropdown.Item>
              <Dropdown.Item className="menu-item" onClick={() => onClickConfiguration()}>
                <p className="mb-1 menu-item-text" style={{ color: 'white' }}> Configurações
                  <FontAwesomeIcon icon={faGear} className="ms-2" />
                </p>
              </Dropdown.Item>
              <Dropdown.Item className="menu-item" onClick={() => onClickLogout()}>
                <p className="mb-1 menu-item-text" style={{ color: 'white' }}> Sair
                  <FontAwesomeIcon icon={faRightFromBracket} className="ms-2" />
                </p>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <hr />
    </>
  );
}
