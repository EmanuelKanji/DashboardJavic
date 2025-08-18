/**
 * pages/DealContacts.js
 * ----------------------------------------------------------------------------
 * Libreta de contactos (contratos cerrados) - V1.1
 * - Lista (tabla desktop con scroll / tarjetas móvil).
 * - "Agregar contacto" → abre DealContactForm.
 * - Menú por contacto (⋮): Modificar (placeholder V2) / Eliminar (funcional).
 * - API: getDealContacts, createDealContact, deleteDealContact.
 * ----------------------------------------------------------------------------
 */

import React, { useEffect, useMemo, useState, useContext } from "react";
import styled from "styled-components";
import { FaEllipsisV } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import {
  getDealContacts,
  createDealContact,
  deleteDealContact,
} from "../api/dealContacts";
import DealContactForm from "../components/DealContactForm";

const NAVBAR_HEIGHT = 72;
const BP_MD = 768;

/* Layout base --------------------------------------------------------------- */
const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Main = styled.main`
  position: relative;
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
`);

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
  font-family: "Inter", sans-serif;
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

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* Botón de 3 puntitos + menú ------------------------------------------------ */
const MenuWrap = styled.div`
  position: relative;
  display: inline-flex;
  z-index: 10; /* por encima del contenido de la tarjeta */
`;

const MenuButton = styled.button`
  border: 1px solid #e2e8f0;
  background: #fff;           /* iOS: evita “botón invisible” */
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { background: #f8fafc; }
  &:active { transform: translateY(0.5px); }
`;

const Popup = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  min-width: 170px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 22px rgba(2, 6, 23, 0.12);
  border-radius: 10px;
  padding: 6px;
  z-index: 9999; /* asegura visibilidad sobre todo */
`;

const PopupItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: ${({ $danger }) => ($danger ? "#b91c1c" : "#0f172a")};
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s ease;

  &:hover { background: #f1f5f9; }
`;

/* Tabla (desktop) ----------------------------------------------------------- */
const TableCard = styled.section`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  overflow-y: hidden;

  @media (max-width: ${BP_MD}px) { display: none; }
`;

const TableInner = styled.div`
  min-width: 1280px; /* asegura la columna de acciones */
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1fr 1.4fr 1.2fr 1.1fr 1.1fr auto; /* última = acciones */
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
  justify-content: flex-end;
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
  position: relative; /* ancla el popup dentro de la tarjeta */
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

  // Menú abierto (id del contacto)
  const [openMenuId, setOpenMenuId] = useState(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* Cargar datos ------------------------------------------------------------ */
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

  /* Crear (modal) ----------------------------------------------------------- */
  const handleCreate = async (payload) => {
    const created = await createDealContact(payload);
    setItems((prev) => [created, ...prev]);
    setOpenForm(false);
  };

  /* Eliminar ---------------------------------------------------------------- */
  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar este contacto?");
    if (!ok) return;
    try {
      await deleteDealContact(id);
      setItems((prev) => prev.filter((c) => c._id !== id));
      setOpenMenuId(null);
    } catch (e) {
      setError("No se pudo eliminar el contacto. Intenta nuevamente.");
      setTimeout(() => setError(""), 4000);
    }
  };

  /* Editar (placeholder V2) ------------------------------------------------- */
  const handleEdit = (item) => {
    setOpenMenuId(null);
    alert("Editar contacto (V2): pronto habilitaremos esta opción.");
  };

  /* Helpers UI -------------------------------------------------------------- */
  const formatDate = (v) => {
    if (!v) return "—";
    try { return new Date(v).toLocaleDateString("es-CL"); }
    catch { return "—"; }
  };

  const isActive = (it) => {
    if (!it?.fechaTermino) return true;
    return new Date(it.fechaTermino) >= new Date();
  };

  // Evitar que el listener global cierre el popup
  const onMenuButtonClick = (e, id) => {
    e.stopPropagation();
    setOpenMenuId((curr) => (curr === id ? null : id));
  };
  const onPopupClick = (e) => e.stopPropagation();

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

        {/* Tabla (desktop) */}
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
              <Cell style={{ justifyContent: "flex-end" }}>Acciones</Cell>
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

                  {/* Acciones con menú (⋮) */}
                  <ActionsCell>
                    <MenuWrap>
                      <MenuButton
                        aria-label="Acciones"
                        onClick={(e) => onMenuButtonClick(e, it._id)}
                      >
                        <FaEllipsisV size={14} />
                      </MenuButton>

                      {openMenuId === it._id && (
                        <Popup onClick={onPopupClick}>
                          <PopupItem onClick={() => handleEdit(it)}>Modificar</PopupItem>
                          <PopupItem $danger onClick={() => handleDelete(it._id)}>
                            Eliminar
                          </PopupItem>
                        </Popup>
                      )}
                    </MenuWrap>
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

                  {/* Menú en móvil */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge $active={isActive(it)}>
                      {isActive(it) ? "Activo" : "Finalizado"}
                    </Badge>

                    <MenuWrap onClick={(e) => e.stopPropagation()}>
                      <MenuButton
                        aria-label="Acciones"
                        onClick={(e) => onMenuButtonClick(e, it._id)}
                      >
                        <FaEllipsisV size={14} />
                      </MenuButton>

                      {openMenuId === it._id && (
                        <Popup onClick={onPopupClick}>
                          <PopupItem onClick={() => handleEdit(it)}>Modificar</PopupItem>
                          <PopupItem $danger onClick={() => handleDelete(it._id)}>
                            Eliminar
                          </PopupItem>
                        </Popup>
                      )}
                    </MenuWrap>
                  </div>
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

                <CardFooter />
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