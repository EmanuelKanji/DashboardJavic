/**
 * pages/DealContacts.js
 * ----------------------------------------------------------------------------
 * Vista "Libreta de contactos (contratos cerrados)" - V1
 * - Lista (tabla desktop con scroll horizontal si no cabe / tarjetas móvil).
 * - Botón "Agregar contacto" (abre modal con DealContactForm).
 * - Botón "Eliminar" por registro (confirmación + actualización inmediata).
 * - Usa servicios API: getDealContacts, createDealContact, deleteDealContact.
 * - Mantiene el estilo y estructura del Dashboard (Navbar + Sidebar).
 * ----------------------------------------------------------------------------
 */

import React, { useEffect, useMemo, useState, useContext } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getDealContacts, createDealContact, deleteDealContact } from "../api/dealContacts";
import DealContactForm from "../components/DealContactForm";

const NAVBAR_HEIGHT = 72;
const BP_MD = 768;

/* Layout base (igual estilo que tu Dashboard) -------------------------------- */
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

/* Header -------------------------------------------------------------------- */
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

/* Botones ------------------------------------------------------------------- */
const PrimaryBtn = styled.button`
  background-color: #2563eb;
  color: #fff;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { background-color: #1d4ed8; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const DangerBtn = styled.button`
  background-color: #ef4444;
  color: #fff;
  border: none;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { background-color: #dc2626; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

/* Tabla (desktop) -----------------------------------------------------------
   - overflow-x: auto para permitir scroll horizontal si no caben las columnas.
   - TableInner fuerza un ancho mínimo para que la última columna (Acciones)
     no se corte nunca. */
const TableCard = styled.section`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow-x: auto;   /* 👈 importante */
  overflow-y: hidden;

  @media (max-width: ${BP_MD}px) { display: none; }
`;

/* Contenedor interno con ancho mínimo para todas las columnas */
const TableInner = styled.div`
  min-width: 1100px;  /* 👈 ajusta si agregas/quitas columnas */
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1fr 1.4fr 1.2fr 1.1fr 1.1fr 0.9fr; /* + Acciones */
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.2s ease;

  &:hover { background: #f8fafc; }

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
  }
  a:hover { color: #1d4ed8; text-decoration: underline; }
`;

const ActionsCell = styled(Cell)`
  justify-content: flex-start;
  gap: 8px;
`;

/* Tarjetas (móvil) ---------------------------------------------------------- */
const CardsGrid = styled.section`
  display: none;
  @media (max-width: ${BP_MD}px) {
    display: grid;
    gap: 16px;
  }
`;

const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 18px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
`;

const Badge = styled.span`
  background-color: ${({ $active }) => ($active ? "#dcfce7" : "#fee2e2")};
  color: ${({ $active }) => ($active ? "#166534" : "#991b1b")};
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
`;

const CardBody = styled.div`
  display: grid;
  gap: 8px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

const Field = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 10px;

  span { font-size: 0.85rem; color: #64748b; font-weight: 600; }
  a {
    font-size: 0.95rem;
    color: #2563eb;
    word-break: break-word;
    text-decoration: none;
  }
  a:hover { color: #1d4ed8; text-decoration: underline; }
`;

/* Estados ------------------------------------------------------------------- */
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
  font-weight: 600;
`;

function DealContacts() {
  const { logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);

  /* Cargar datos al montar -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getDealContacts();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Error al obtener la libreta de contactos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Total para meta --------------------------------------------------------- */
  const total = useMemo(() => items.length, [items]);

  /* Guardar nuevo (desde el modal) ----------------------------------------- */
  const handleCreate = async (payload) => {
    const created = await createDealContact(payload);
    setItems((prev) => [created, ...prev]); // prepend (más reciente arriba)
  };

  /* Eliminar contacto ------------------------------------------------------- */
  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar este contacto?");
    if (!ok) return;

    try {
      await deleteDealContact(id);
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el contacto. Intenta nuevamente.");
      setTimeout(() => setError(""), 4000);
    }
  };

  /* Helpers UI -------------------------------------------------------------- */
  const formatDate = (v) => {
    if (!v) return "—";
    try {
      return new Date(v).toLocaleDateString("es-CL");
    } catch { return "—"; }
  };

  const isActive = (it) => {
    if (!it?.fechaTermino) return true; // sin término = activo
    const fin = new Date(it.fechaTermino);
    const now = new Date();
    return fin >= now;
  };

  return (
    <Page>
      <Navbar onToggleSidebar={() => setMobileOpen((v) => !v)} />

      <Sidebar
        onLogout={logout}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Main>
        <Head>
          <div>
            <Title>Libreta de contactos</Title>
            <Meta>Total: {total} registros</Meta>
          </div>

          <PrimaryBtn onClick={() => setOpenForm(true)}>
            ➕ Agregar contacto
          </PrimaryBtn>
        </Head>

        {!!error && <Alert>{error}</Alert>}

        {/* Tabla (desktop) con scroll horizontal si no cabe */}
        <TableCard>
          <TableInner>
            <Row>
              <Cell>Nombre</Cell>
              <Cell>Empresa</Cell>
              <Cell>Teléfono</Cell>
              <Cell>Dirección</Cell>
              <Cell>Servicio</Cell>
              <Cell>Inicio</Cell>
              <Cell>Término</Cell>
              <Cell>Acciones</Cell>
            </Row>

            {loading ? (
              <Empty>Cargando libreta...</Empty>
            ) : items.length === 0 ? (
              <Empty>No hay contactos en la libreta</Empty>
            ) : (
              items.map((it) => (
                <Row key={it._id}>
                  <Cell>{it.nombre}</Cell>
                  <Cell>{it.nombreEmpresa}</Cell>
                  <Cell><a href={`tel:${it.telefono}`}>{it.telefono}</a></Cell>
                  <Cell>{it.direccion}</Cell>
                  <Cell title={it.descripcionServicio}>
                    {it.descripcionServicio?.length > 40
                      ? it.descripcionServicio.slice(0, 40) + "…"
                      : it.descripcionServicio || "—"}
                  </Cell>
                  <Cell>{formatDate(it.fechaInicio)}</Cell>
                  <Cell>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {formatDate(it.fechaTermino)}
                      <Badge $active={isActive(it)}>
                        {isActive(it) ? "Activo" : "Finalizado"}
                      </Badge>
                    </span>
                  </Cell>
                  <ActionsCell>
                    <DangerBtn onClick={() => handleDelete(it._id)}>Eliminar</DangerBtn>
                  </ActionsCell>
                </Row>
              ))
            )}
          </TableInner>
        </TableCard>

        {/* Tarjetas (móvil) */}
        <CardsGrid>
          {loading ? (
            <Empty>Cargando libreta...</Empty>
          ) : items.length === 0 ? (
            <Empty>No hay contactos en la libreta</Empty>
          ) : (
            items.map((it) => (
              <Card key={it._id}>
                <CardHeader>
                  <CardTitle>{it.nombreEmpresa}</CardTitle>
                  <Badge $active={isActive(it)}>
                    {isActive(it) ? "Activo" : "Finalizado"}
                  </Badge>
                </CardHeader>

                <CardBody>
                  <Field>
                    <span>Nombre</span>
                    <div>{it.nombre}</div>
                  </Field>
                  <Field>
                    <span>Teléfono</span>
                    <a href={`tel:${it.telefono}`}>{it.telefono}</a>
                  </Field>
                  <Field>
                    <span>Dirección</span>
                    <div>{it.direccion}</div>
                  </Field>
                  <Field>
                    <span>Inicio</span>
                    <div>{formatDate(it.fechaInicio)}</div>
                  </Field>
                  <Field>
                    <span>Término</span>
                    <div>{formatDate(it.fechaTermino)}</div>
                  </Field>
                  <Field style={{ gridColumn: "1 / -1" }}>
                    <span>Servicio</span>
                    <div>{it.descripcionServicio}</div>
                  </Field>
                </CardBody>

                <CardFooter>
                  <DangerBtn onClick={() => handleDelete(it._id)}>Eliminar</DangerBtn>
                </CardFooter>
              </Card>
            ))
          )}
        </CardsGrid>
      </Main>

      {/* Modal crear */}
      <DealContactForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreate}
      />
    </Page>
  );
}

export default DealContacts;