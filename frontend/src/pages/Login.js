/**
 * Login.js
 * ----------------------------------------------------------------------------
 * Página de inicio de sesión con estilo coordinado al sistema
 * - Misma paleta de colores que Sidebar y Navbar
 * - Diseño profesional y minimalista
 * - Mantiene toda la funcionalidad original
 * ----------------------------------------------------------------------------
 */

import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logo.png";

// Constantes de diseño (coordinadas con Sidebar/Navbar)
const BP_MD = 768;
const BP_SM = 480;
const DARK_BG = "#0f172a";         // Fondo principal
const ACCENT_COLOR = "#2563eb";    // Azul corporativo
const TEXT_LIGHT = "#f8fafc";      // Texto claro
const TEXT_GRAY = "#94a3b8";       // Texto secundario
const BORDER_DARK = "#1e293b";     // Bordes

/* Contenedor principal */
const LoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

/* Encabezado */
const Header = styled.header`
  width: 100%;
  padding: 20px 24px;
  background-color: ${DARK_BG};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid ${BORDER_DARK};
`;

const Logo = styled.img`
  height: 36px;
  filter: invert(1) brightness(1.5) contrast(1.1);
`;

/* Contenedor del formulario */
const LoginContainer = styled.section`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f8fafc;
`;

/* Tarjeta de login */
const LoginCard = styled.div`
  background-color: ${DARK_BG};
  padding: 2.5rem;
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid ${BORDER_DARK};

  @media (max-width: ${BP_MD}px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${ACCENT_COLOR};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${ACCENT_COLOR};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem;
  background-color: #fee2e2;
  border-radius: 6px;
`;

/* Componente Login */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (
    <LoginWrapper>
      <Header>
        <Logo src={logo} alt="Logo" />
      </Header>

      <LoginContainer>
        <LoginCard>
          <Title>Iniciar Sesión</Title>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit">Ingresar</Button>
          </Form>
        </LoginCard>
      </LoginContainer>
    </LoginWrapper>
  );
};

export default Login;