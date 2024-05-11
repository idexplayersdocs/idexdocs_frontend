import { faBars, faHouse, faRightFromBracket, faGear, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import React from "react";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
        <div className="me-auto p-2">
          <Link href="/">
            <FontAwesomeIcon
              className="me-3"
              icon={faHouse}
              size="2xl"
              style={{ color: "var(--bg-ternary-color)", cursor: "pointer" }}
            />
          </Link>

          <Image src="/images/logo-fort-house.png" width={105} height={70} alt="company logo" />
        </div>

        {/* <Link href="/" className="p-2 me-3"> */}
        <div className="p-2 me-3">
          <Image src="/images/logo-arabe.png" width={78} height={78} alt="company logo" />
        </div>
        {/* </Link> */}

        <div>
          <FontAwesomeIcon
            className="p-2"
            icon={faBars}
            size="2xl"
            style={{ color: "var(--bg-ternary-color)", cursor: "pointer" }}
            onClick={handleClick}
          />
          <Menu
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
