import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import React from "react";
/* import { DatePicker } from "@nextui-org/react"; */
import Inicio from './components/pages/Inicio';
import RegistroUser from './components/pages/RegistroUser';
import IniciarSesion from './components/pages/IniciarSesion';
import DashboardAdmi from './components/pages/DashboardAdmi';
import DashboardUser from './components/pages/DashboardUser';
import { Mascotas } from "./components/pages/Mascota";
import GlobalProvider from "./context/GlobalContext";
import { ListsMascotas } from "./components/pages/ListsMascotas";
import { Notificaciones } from "./components/pages/Notificaciones";
import PerfilUsuario from "./components/pages/Perfil";
import Graficas from "./components/pages/Grafica";

// import { Notificaciones } from "./components/pages/notificaciones";




function App() {
  const stored = localStorage.getItem('user')
  const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

  return (
    <>
      <BrowserRouter >
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/iniciosesion" element={<IniciarSesion />} />
            <Route path="/registro" element={<RegistroUser />} />


            {user && user.rol === 'administrador' && (
              <>
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/inicioadmi" element={<DashboardAdmi />} />
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/graficas" element={<Graficas />} />
              </>
            )}
            {user && user.rol === 'usuario' && (
              <>
                <Route path="/iniciouser" element={<DashboardUser />} />
                <Route path="/listmascotas" element={<ListsMascotas />} />
                <Route path="/perfil" element={<PerfilUsuario />} />
              </>
            )}
          </Routes >
        </GlobalProvider>
      </BrowserRouter >
    </>
  )
}

export default App;
