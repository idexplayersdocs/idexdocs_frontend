import { faBars, faHouse, faRightFromBracket, faGear, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import React from "react";
import Subtitle from "./Subtitle";

export default function Header({page}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

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

  const onClickConfiguration = (): void => {
    setAnchorEl(null);
    router.push("/secure/profile-configuration");
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-3">
        <div className="p-2">
          <Image src="/images/logo-fort-house.png" width={118} height={78} alt="company logo" />
          {/* <Link href="/">
          </Link> */}
        </div>
        <div className="d-flex w-100 justify-content-around nav-bar-custom">
          {/* <h1>Home</h1> */}
          <Link href="/" style={{textDecoration: 'none'}}>
          <div className="nav-custom">
              <div className="icon-menu">
                  <div className="icon-menu-content d-flex">
                      <FontAwesomeIcon icon={faHouse} size="lg" color="white" className="icon-menu" style={{marginTop: '1px', marginRight: '10px'}} />
                      <h2 style={{color:'white', fontSize: '22px'}}>Home</h2>
                  </div>
              </div>
          </div>
          </Link>
          <div className="nav-custom">
              <div className="icon-menu">
                  <div className="icon-menu-content d-flex">
                      <FontAwesomeIcon icon={faGear} size="lg" color="white" className="icon-menu" style={{marginTop: '1px', marginRight: '10px'}} />
                      <h2 style={{color:'white', fontSize: '20px'}}>Configuração</h2>
                  </div>
              </div>
          </div>
          <div className="nav-custom">
              <div className="icon-menu">
                  <div className="icon-menu-content d-flex">
                      <FontAwesomeIcon icon={faRightFromBracket} size="lg" color="white" className="icon-menu" style={{marginTop: '1px', marginRight: '10px'}} />
                      <h2 style={{color:'white', fontSize: '20px'}}>Sair</h2>
                  </div>
              </div>
          </div>
        </div>
        {/* <Link href="/" className="p-2 me-3"> */}
        {/* </Link> */}
        <div className="d-flex align-items-center">
          <div className="p-2 me-3">
            <Image src="/images/logo-arabe.png" width={78} height={78} alt="company logo" />
          </div>
          <FontAwesomeIcon
            className="p-2 menu-hamburguer"
            icon={faBars}
            size="2xl"
            style={{ color: "var(--bg-ternary-color)", cursor: "pointer" }}
            onClick={handleClick}
          />
          <Menu
            sx={
              { mt: "1px", "& .MuiMenu-paper": 
                { backgroundColor: "var(--bg-secondary-color)", color: 'white' }, 
              }
            }
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => onClickConfiguration()}>
              <p className="mb-1">
                Configurações <FontAwesomeIcon icon={faGear} />
              </p>
            </MenuItem>
            <MenuItem onClick={() => onClickLogout()}>
              <p className="mb-1">
                Sair <FontAwesomeIcon icon={faRightFromBracket} />
              </p> 
            </MenuItem>
          </Menu>
        </div>
      </div>
      <hr />
    </>
  );
}
