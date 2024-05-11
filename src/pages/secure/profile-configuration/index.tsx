import Header from "@/components/Header";
import Title from "@/components/Title";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import React from "react";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tabs from "@mui/material/Tabs";

import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { UsuarioRequestDTO } from "@/pages/api/http-service/usuarioService/dto";

const StyledTab = styled(Tab)({
  color: "#626262",
  "&.Mui-selected": {
    color: "#ff781d",
  },
});

export default function ProfileConfiguration() {
  const [tabValue, setTabValue] = React.useState<string>("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    handleSubmit: handleSubmitCreateUser,
    register: registerCreateUser,
    formState: { errors: errosUserCreate },
  } = useForm<UsuarioRequestDTO>();

  return (
    <>
      <Header />
      <div className="w-75 mx-auto">
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
            TabIndicatorProps={{
              style: {
                backgroundColor: "#626262",
              },
            }}
          >
            <StyledTab label="Editar Perfil" value="1" />
            <StyledTab label="Criar Usuários" value="2" />
            <StyledTab label="Editar Usuários" value="3" />
          </TabList>
          <TabPanel value="1">
            <div className="w-75 mx-auto mt-5">
              <form>
                <div>
                  <label className="d-block text-white h4">Nome:</label>
                  <input type="text" className="w-100 p-2 rounded border-0" />
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Email:</label>
                  <input type="text" className="w-100 p-2 rounded border-0" />
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Email:</label>
                  <input type="text" className="w-100 p-2 rounded border-0" />
                </div>
                <div className="mt-4">
                  <label className="d-block text-white h4">Senha:</label>
                  <input type="password" className="w-100 p-2 rounded border-0" />
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-end">
                  <button className="bg-success btn text-white w-50" type="button">
                    Atualizar
                  </button>
                </div>
              </form>
            </div>
          </TabPanel>
          <TabPanel value="2"><div className="w-75 mx-auto mt-5">
          <form>
            <div>
              <label className="d-block text-white h4">Nome:</label>
              <input type="text" className="w-100 p-2 rounded border-0" {...registerCreateUser("nome", {
                required: true
              })}/>
            </div>
            <div className="mt-4">
              <label className="d-block text-white h4">Email:</label>
              <input type="text" className="w-100 p-2 rounded border-0" />
            </div>
            <div className="mt-4">
              <label className="d-block text-white h4">Email:</label>
              <input type="text" className="w-100 p-2 rounded border-0" />
            </div>
            <div className="mt-4">
              <label className="d-block text-white h4">Senha:</label>
              <input type="password" className="w-100 p-2 rounded border-0" />
            </div>
            <div className="mt-4 d-flex align-items-center justify-content-end">
              <button className="bg-success btn text-white w-50" type="button">
                Atualizar
              </button>
            </div>
          </form>
        </div></TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
        {/*  */}
      </div>
    </>
  );
}
