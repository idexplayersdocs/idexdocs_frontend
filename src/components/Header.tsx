"use client";
import {
  faBars,
  faHouse,
  faRightFromBracket,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import React from "react";

import { jwtDecode } from "jwt-decode";
import { Box, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { DecodedToken } from '@/types';

export default function Header() {
  const { i18n } = useTranslation("translation", { keyPrefix: "menu" });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [decoded, setDecoded] = React.useState<DecodedToken | null>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  // const token: any = localStorage.getItem("token");
  // const decoded: any = jwtDecode(token!);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const { getStoredToken } = require("@/lib/auth");
      const token = getStoredToken();
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setDecoded(decodedToken);
      }
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = (): void => {
    setAnchorEl(null);
    const { createAuthService } = require("@/lib/auth");
    const authService = createAuthService();
    // Clear tokens and headers without triggering the hard redirect
    // so we can use Next.js router for a smooth client-side navigation
    authService.logoutWithoutRedirect();
    router.push("/public/login");
  };
  const onClickHome = (): void => {
    router.push("/secure/athletes");
  };

  const onClickConfiguration = (): void => {
    setAnchorEl(null);
    router.push("/secure/profile-configuration");
  };

  const setLanguage = (lang: string) => {
    console.log(`setLanguage`, lang);
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <div className="mt-4 text-center">
        <Box
          sx={{ display: "flex", alignItems: "center", paddingX: 2 }}
        >
          <h2 style={{ color: "white", fontSize: "20px", flex: 1, textAlign: "center" }}>
            Olá!{" "}
            <span style={{ color: "var(--bg-ternary-color)" }}>
              {decoded?.user_name}
            </span>
          </h2>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Select
              onChange={(e) => setLanguage(e.target.value)}
              defaultValue={i18n.language}
              sx={{
                border: 0,
                pl: 2,
                p: 0, // remove padding interno
                "& .MuiSelect-select": {
                  border: 0,
                  py: 1,
                  px: 2, // remove padding do texto
                },
                "& .MuiSelect-nativeInput": {
                  border: 0,
                },
              }}
            >
              <MenuItem value="pt">🇧🇷</MenuItem>
              <MenuItem value="en">🇺🇸</MenuItem>
              <MenuItem value="es">🇪🇸</MenuItem>
            </Select>
          </Box>
        </Box>
      </div>
      <div className="d-flex justify-content-between align-items-center m-3">
        <div className="p-2">
          <Image
            src="/images/logo-fort-house.png"
            width={118}
            height={78}
            alt="company logo"
          />
        </div>
        <div className="w-100 justify-content-evenly nav-bar-custom">
          <Link href="/" style={{ textDecoration: "none" }}>
            <div className="nav-custom">
              <div className="icon-menu">
                <div className="icon-menu-content d-flex">
                  <FontAwesomeIcon
                    icon={faHouse}
                    size="lg"
                    color="white"
                    className="icon-menu"
                    style={{ marginTop: "1px", marginRight: "10px" }}
                  />
                  <h2 style={{ color: "white", fontSize: "22px" }}>Home</h2>
                </div>
              </div>
            </div>
          </Link>
          <div className="nav-custom">
            <div className="icon-menu">
              <div
                className="icon-menu-content d-flex"
                onClick={() => onClickConfiguration()}
              >
                <FontAwesomeIcon
                  icon={faGear}
                  size="lg"
                  color="white"
                  className="icon-menu"
                  style={{ marginTop: "1px", marginRight: "10px" }}
                />
                <h2 style={{ color: "white", fontSize: "20px" }}>
                  Configurações
                </h2>
              </div>
            </div>
          </div>
          <div className="nav-custom">
            <div className="icon-menu">
              <div
                className="icon-menu-content d-flex"
                onClick={() => onClickLogout()}
              >
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  size="lg"
                  color="white"
                  className="icon-menu"
                  style={{ marginTop: "1px", marginRight: "10px" }}
                />
                <h2 style={{ color: "white", fontSize: "20px" }}>Sair</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="p-2 me-3">
            <Image
              src="/images/logo-arabe-circle.png"
              width={78}
              height={78}
              alt="company logo"
            />
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
