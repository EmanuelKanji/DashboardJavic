/**
 * Navbar.js
 * ----------------------------------------------------------------------------
 * Barra superior con estilo idéntico al Sidebar
 * - Mismo color de fondo exacto (#0f172a)
 * - Eliminado el botón de cerrar sesión (se mueve al Sidebar)
 * - Conserva todas las demás funcionalidades
 * ----------------------------------------------------------------------------
 */

import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

// Constantes de diseño (idénticas al Sidebar)
export const NAVBAR_HEIGHT = 72;
const BP_MD = 768;
const DARK_BG = "#0f172a";         // Exactamente igual al Sidebar
const TEXT_LIGHT = "#f8fafc";      // Texto claro
const BORDER_DARK = "#1e293b";     // Bordes
const HOVER_BG = "#1e293b";        // Fondo hover

/* Contenedor principal */
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${NAVBAR_HEIGHT}px;
  width: 100%;
  background: ${DARK_BG};          // Mismo color que Sidebar
  color: ${TEXT_LIGHT};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid ${BORDER_DARK};
  z-index: 1100;
  font-family: 'Inter', sans-serif;
`;

/* Lado izquierdo: hamburguesa + logo + título */
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/* Botón hamburguesa */
const Burger = styled.button`
  display: none;
  
  @media (max-width: ${BP_MD}px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: ${TEXT_LIGHT};
    font-size: 24px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: ${HOVER_BG};
    }
  }
`;

const Logo = styled.img`
  height: 36px;
  filter: invert(1) brightness(1.5) contrast(1.1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${TEXT_LIGHT};

  @media (max-width: 480px) {
    display: none;
  }
`;

/* Lado derecho: usuario */
const Right = styled.div`
  display: flex;
  align-items: center;
`;

const User = styled.span`
  color: #94a3b8;
  font-size: 0.95rem;

  @media (max-width: 540px) {
    display: none;
  }
`;

/* Componente principal */
const Navbar = ({ onToggleSidebar }) => {
  const { user } = useContext(AuthContext); // Eliminado logout ya que no se usa
  const navigate = useNavigate();

  return (
    <Nav>
      <Left>
        <Burger aria-label="Abrir menú" onClick={onToggleSidebar}>
          ☰
        </Burger>

        <Logo src={logo} alt="Logo" />
        <Title>Panel de Administración</Title>
      </Left>

      <Right>
        {user?.name && <User>Hola, {user.name}</User>}
        {/* Eliminado el botón de cerrar sesión */}
      </Right>
    </Nav>
  );
};

export default Navbar;