/**
 * Sidebar.js (adaptado)
 * ----------------------------------------------------------------------------
 * - Mantiene el estilo oscuro y la estructura original.
 * - Agrega navegación a la "Libreta de contactos" en /libreta.
 * - Marca activo cada item según la ruta actual.
 * - Cierra el sidebar en móvil al navegar (onClose()).
 * ----------------------------------------------------------------------------
 */

import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { NAVBAR_HEIGHT } from "./Navbar";

// Constantes de diseño
export const SIDEBAR_WIDTH = 260;
const BP_MD = 768;

// Paleta profesional oscura
const DARK_BG = "#0f172a";
const DARK_NAV = "#020617";
const ACCENT_COLOR = "#2563eb";
const TEXT_LIGHT = "#f8fafc";
const TEXT_GRAY = "#94a3b8";
const BORDER_DARK = "#1e293b";
const HOVER_BG = "#1e293b";

/* Contenedor principal */
const SidebarContainer = styled.aside`
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: ${({ $open }) => ($open ? "0" : `-${SIDEBAR_WIDTH}px`)};
  background: ${DARK_BG};
  border-right: 1px solid ${BORDER_DARK};
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 24px 0;

  @media (min-width: ${BP_MD}px) {
    left: 0;
    top: ${NAVBAR_HEIGHT}px;
    height: calc(100vh - ${NAVBAR_HEIGHT}px);
  }
`;

/* Backdrop para móvil */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.3s ease;

  @media (min-width: ${BP_MD}px) {
    display: none;
  }
`;

/* Logo y marca */
const Brand = styled.div`
  padding: 0 24px 24px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${BORDER_DARK};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${TEXT_LIGHT};
  letter-spacing: 0.5px;
`;

/* Menú de navegación */
const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  padding: 0 16px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  background: ${({ $active }) => ($active ? DARK_NAV : "transparent")};
  color: ${({ $active }) => ($active ? TEXT_LIGHT : TEXT_GRAY)};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${HOVER_BG};
    color: ${TEXT_LIGHT};
  }

  &:active { transform: scale(0.98); }
`;

const MenuIcon = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  color: ${({ $active }) => ($active ? ACCENT_COLOR : "inherit")};
`;

/* Pie del sidebar */
const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid ${BORDER_DARK};
`;

const Sidebar = ({ onLogout, open = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Activos por ruta
  const isDashboard = pathname.startsWith("/dashboard");
  const isLibreta  = pathname.startsWith("/libreta");

  // Navega y cierra el sidebar en móvil
  const go = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />

      <SidebarContainer $open={open}>
        <Brand>
          <Logo>Menú</Logo>
        </Brand>

        <Menu>
          {/* Panel (dashboard) */}
          <MenuItem
            $active={isDashboard}
            onClick={() => go("/dashboard")}
            aria-current={isDashboard ? "page" : undefined}
          >
            <MenuIcon $active={isDashboard}><FaTachometerAlt /></MenuIcon>
            <span>Panel</span>
          </MenuItem>

          {/* Contactos → Libreta (V1) */}
          <MenuItem
            $active={isLibreta}
            onClick={() => go("/libreta")}
            aria-current={isLibreta ? "page" : undefined}
          >
            <MenuIcon $active={isLibreta}><FaEnvelope /></MenuIcon>
            <span>Contactos</span>
          </MenuItem>
        </Menu>

        <Footer>
          <MenuItem onClick={onLogout}>
            <MenuIcon><FaSignOutAlt /></MenuIcon>
            <span>Cerrar Sesión</span>
          </MenuItem>
        </Footer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;