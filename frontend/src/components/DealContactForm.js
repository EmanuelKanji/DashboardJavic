/**
 * components/DealContactForm.js
 * ----------------------------------------------------------------------------
 * Formulario modal para la "Libreta de contactos (contratos cerrados)".
 * - Sigue el estilo visual del Dashboard (Inter, bordes, radios, sombras).
 * - Valida campos obligatorios y la relación de fechas (termino >= inicio).
 * - No llama a la API directamente: delega en onSubmit(payload) recibido por props.
 *
 * Props:
 *  - open: boolean                → controla visibilidad
 *  - onClose: function            → cierra el modal
 *  - onSubmit: async function     → recibe payload listo para crear/editar
 *  - initialValues?: object       → (futuro) para edición
 * ----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import styled from "styled-components";

/* Overlay de fondo (oscurece la pantalla) ---------------------------------- */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35); /* similar a slate-900/35 */
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000; /* por encima del layout */
`;

/* Contenedor del modal (tarjeta) ------------------------------------------- */
const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border: 1px solid #e2e8f0;        /* borde como tus cards */
  border-radius: 10px;              /* mismo radio que TableCard */
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
  padding: 24px;
`;

/* Cabecera del modal -------------------------------------------------------- */
const Head = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b; /* tono de títulos del dashboard */
  font-family: 'Inter', sans-serif;
`;

const Close = styled.button`
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
  color: #334155; /* slate-700 */
`;

/* Grids y campos ------------------------------------------------------------ */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;

  label {
    font-size: 0.9rem;
    color: #475569; /* slate-600 */
    font-weight: 600;
    font-family: 'Inter', sans-serif;
  }

  input, textarea {
    border: 1px solid #cbd5e1; /* slate-300 */
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.95rem;
    outline: none;
    font-family: 'Inter', sans-serif;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
`;

const Btn = styled.button`
  background: ${({ $variant }) => ($variant === "ghost" ? "#e2e8f0" : "#2563eb")};
  color: ${({ $variant }) => ($variant === "ghost" ? "#0f172a" : "#fff")};
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;

  &:hover {
    background: ${({ $variant }) => ($variant === "ghost" ? "#cbd5e1" : "#1d4ed8")};
  }
`;

const Error = styled.div`
  margin-top: 8px;
  color: #b91c1c; /* red-700 */
  background: #fee2e2; /* red-100 */
  border: 1px solid #fecaca; /* red-200 */
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

/* Estado inicial del formulario -------------------------------------------- */
const initialForm = {
  nombre: "",
  nombreEmpresa: "",
  telefono: "",
  direccion: "",
  descripcionServicio: "",
  fechaInicio: "",
  fechaTermino: "",
};

function DealContactForm({ open, onClose, onSubmit, initialValues }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  /* Cargar valores iniciales (para edición futura) ------------------------- */
  useEffect(() => {
    if (initialValues) {
      setForm({
        nombre: initialValues?.nombre || "",
        nombreEmpresa: initialValues?.nombreEmpresa || "",
        telefono: initialValues?.telefono || "",
        direccion: initialValues?.direccion || "",
        descripcionServicio: initialValues?.descripcionServicio || "",
        // Adaptar a input type="date" (YYYY-MM-DD)
        fechaInicio: initialValues?.fechaInicio
          ? new Date(initialValues.fechaInicio).toISOString().slice(0, 10)
          : "",
        fechaTermino: initialValues?.fechaTermino
          ? new Date(initialValues.fechaTermino).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [open, initialValues]);

  /* Handlers ---------------------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /* Validaciones simples (frontend) ---------------------------------------- */
  const validate = () => {
    if (!form.nombre?.trim()) return "El nombre es obligatorio";
    if (!form.nombreEmpresa?.trim()) return "El nombre de la empresa es obligatorio";
    if (!form.telefono?.trim()) return "El teléfono es obligatorio";
    if (!/^[0-9+()\-.\s]+$/.test(form.telefono)) return "Formato de teléfono inválido";
    if (!form.direccion?.trim()) return "La dirección es obligatoria";
    if (!form.descripcionServicio?.trim()) return "La descripción del servicio es obligatoria";

    if (form.fechaInicio && form.fechaTermino) {
      const ini = new Date(form.fechaInicio);
      const fin = new Date(form.fechaTermino);
      if (fin < ini) return "La fecha de término debe ser posterior o igual a la fecha de inicio";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    // Construir payload (fechas a ISO si existen)
    const payload = {
      nombre: form.nombre.trim(),
      nombreEmpresa: form.nombreEmpresa.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      descripcionServicio: form.descripcionServicio.trim(),
      fechaInicio: form.fechaInicio ? new Date(form.fechaInicio).toISOString() : null,
      fechaTermino: form.fechaTermino ? new Date(form.fechaTermino).toISOString() : null,
    };

    try {
      await onSubmit(payload); // delega en el padre
      onClose();              // cierra si todo ok
    } catch (err) {
      setError(err?.message || "Error al guardar");
    }
  };

  /* Render ------------------------------------------------------------------ */
  return (
    <Overlay $show={open} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Head>
          <Title>Agregar contacto</Title>
          <Close onClick={onClose} aria-label="Cerrar">✕</Close>
        </Head>

        {error && <Error>{error}</Error>}

        <form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <label htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
            </Field>

            <Field>
              <label htmlFor="nombreEmpresa">Nombre empresa *</label>
              <input id="nombreEmpresa" name="nombreEmpresa" value={form.nombreEmpresa} onChange={handleChange} />
            </Field>

            <Field>
              <label htmlFor="telefono">Teléfono *</label>
              <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
            </Field>

            <Field>
              <label htmlFor="direccion">Dirección *</label>
              <input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} />
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="descripcionServicio">Descripción del servicio *</label>
              <textarea
                id="descripcionServicio"
                name="descripcionServicio"
                value={form.descripcionServicio}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <label htmlFor="fechaInicio">Fecha de inicio (opcional)</label>
              <input id="fechaInicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} />
            </Field>

            <Field>
              <label htmlFor="fechaTermino">Fecha de término (opcional)</label>
              <input id="fechaTermino" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleChange} />
            </Field>
          </Grid>

          <Actions>
            <Btn type="button" $variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn type="submit">Guardar</Btn>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}

export default DealContactForm;