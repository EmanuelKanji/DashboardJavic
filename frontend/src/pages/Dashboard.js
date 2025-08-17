/**
 * Dashboard.js
 */

import React, { useEffect, useMemo, useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { getContacts, deleteContact, markAsContacted } from "../api/contacts";
import Navbar from "../components/Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";

const NAVBAR_HEIGHT = 72;
const BP_MD = 768;

/* Contenedores principales */
const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Main = styled.main`
  background: #ffffff;
  min-height: calc(100vh - ${NAVBAR_HEIGHT}px);
  padding: 32px;
  padding-top: calc(${NAVBAR_HEIGHT}px + 24px);
  margin-left: ${SIDEBAR_WIDTH}px;
  transition: margin-left 0.3s ease;

  @media (max-width: ${BP_MD}px) {
    margin-left: 0;
    padding: 24px;
    padding-top: calc(${NAVBAR_HEIGHT}px + 16px);
  }
`;

/* Cabecera */
const Head = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
`;

const Meta = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
`;

/* Vista Tabla */
const TableCard = styled.section`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;

  @media (max-width: ${BP_MD}px) {
    display: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1fr 0.9fr 1.3fr;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:first-child {
    background-color: #f8fafc;
    font-weight: 600;
    color: #334155;
  }
`;

const Cell = styled.div`
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;

  a {
    color: #2563eb;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  a:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

/* Vista Tarjetas */
const CardsGrid = styled.section`
  display: none;

  @media (max-width: ${BP_MD}px) {
    display: grid;
    gap: 16px;
  }
`;

const ContactCard = styled.article`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 18px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

const Badge = styled.span`
  background-color: ${({ $ok }) => ($ok ? "#dcfce7" : "#fef9c3")};
  color: ${({ $ok }) => ($ok ? "#166534" : "#854d0e")};
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
`;

const CardBody = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
`;

const Field = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 10px;

  span {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }
  a {
    font-size: 0.95rem;
    color: #2563eb;
    text-decoration: none;
    word-break: break-word;
    transition: color 0.2s ease;
  }
  a:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

const CardFooter = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${({ $variant }) =>
    $variant === "danger" ? "#ef4444" : "#2563eb"};
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === "danger" ? "#dc2626" : "#1d4ed8"};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* Estados */
const Empty = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
`;

const Alert = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 14px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
`;

/* Componente Principal */
const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getContacts(token);
        setContacts(Array.isArray(data) ? data : []);
      } catch {
        setError("Error al obtener contactos");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const total = useMemo(() => contacts.length, [contacts]);

  const handleDelete = async (id) => {
    try {
      await deleteContact(id, token);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
      setError("No se pudo eliminar el contacto.");
    }
  };

  const handleMarkAsContacted = async (id) => {
    try {
      await markAsContacted(id, token);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, contacted: true } : c))
      );
    } catch {
      setError("No se pudo actualizar el estado.");
    }
  };

  const handleLogout = () => logout();

  return (
    <Page>
      <Navbar onToggleSidebar={() => setMobileOpen((v) => !v)} />

      <Sidebar
        onLogout={handleLogout}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Main>
        <Head>
          <div>
            <Title>Contactos Recibidos</Title>
            <Meta>Total: {total} registros</Meta>
          </div>
        </Head>

        {!!error && <Alert>{error}</Alert>}

        <TableCard>
          <Row>
            <Cell>Nombre</Cell>
            <Cell>Email</Cell>
            <Cell>Teléfono</Cell>
            <Cell>Estado</Cell>
            <Cell>Acciones</Cell>
          </Row>

          {loading ? (
            <Empty>Cargando contactos...</Empty>
          ) : contacts.length === 0 ? (
            <Empty>No hay contactos registrados</Empty>
          ) : (
            contacts.map((c) => (
              <Row key={c._id}>
                <Cell>{c.name}</Cell>
                <Cell><a href={`mailto:${c.email}`}>{c.email}</a></Cell>
                <Cell><a href={`tel:${c.phone}`}>{c.phone}</a></Cell>
                <Cell>
                  <Badge $ok={!!c.contacted}>
                    {c.contacted ? "Contactado" : "Pendiente"}
                  </Badge>
                </Cell>
                <Cell style={{ display: "flex", gap: 8 }}>
                  {!c.contacted && (
                    <Button onClick={() => handleMarkAsContacted(c._id)}>
                      Contactado
                    </Button>
                  )}
                  <Button $variant="danger" onClick={() => handleDelete(c._id)}>
                    Eliminar
                  </Button>
                </Cell>
              </Row>
            ))
          )}
        </TableCard>

        <CardsGrid>
          {loading ? (
            <Empty>Cargando contactos...</Empty>
          ) : contacts.length === 0 ? (
            <Empty>No hay contactos registrados</Empty>
          ) : (
            contacts.map((c) => (
              <ContactCard key={c._id}>
                <CardHeader>
                  <CardName>{c.name}</CardName>
                  <Badge $ok={!!c.contacted}>
                    {c.contacted ? "Contactado" : "Pendiente"}
                  </Badge>
                </CardHeader>

                <CardBody>
                  <Field>
                    <span>Email</span>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </Field>
                  <Field>
                    <span>Teléfono</span>
                    <a href={`tel:${c.phone}`}>{c.phone}</a>
                  </Field>
                </CardBody>

                <CardFooter>
                  {!c.contacted && (
                    <Button onClick={() => handleMarkAsContacted(c._id)}>
                      Contactado
                    </Button>
                  )}
                  <Button $variant="danger" onClick={() => handleDelete(c._id)}>
                    Eliminar
                  </Button>
                </CardFooter>
              </ContactCard>
            ))
          )}
        </CardsGrid>
      </Main>
    </Page>
  );
};

export default Dashboard;