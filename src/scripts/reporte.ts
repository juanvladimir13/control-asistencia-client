import { API_URL } from "astro:env/client";

import type { IPersona, IPlanilla } from "@datatypes/datatypes";
import { KEY_PLANILLA_SELECCIONADA, KEY_PLANILLAS } from "@datatypes/data";

const renderPersonaItem = (persona: IPersona) => {
  const asistenteHTML = document.createElement("div");
  asistenteHTML.classList.add("border-bottom", "mb-2");
  asistenteHTML.innerHTML = `
    <p class="m-0">${persona.apellidos} ${persona.nombres}</p>
    <div class="text-center">
      <span>
        <i class="bi bi-person-walking" style="font-size: 20px; color: green;"></i>
          ${persona.hora_ingreso ? persona.hora_ingreso.substring(0, 5) : ''}
      </span>
      <span>
        <i class="bi bi-person-raised-hand" style="font-size: 20px; color: red;"></i>
        ${persona.hora_salida ? persona.hora_salida.substring(0, 5) : ''}
      </span>
    </div>`;
  return asistenteHTML;
};

const mostrarListaAsistencia = (estado: string) => {
  const planillaSeleccionada = localStorage.getItem(KEY_PLANILLA_SELECCIONADA) || 0;
  fetchListaDeAsistencia("/api/planilla/asistencia", {
    planilla_id: planillaSeleccionada,
    estado: estado,
  });
};

const fetchListaDeAsistencia = (url: string, data: any) => {
  const asistentesContainer = document.getElementById("asistentes-container");

  fetch(
    `${API_URL}${url}?planilla_id=${data.planilla_id}&estado=${data.estado}`,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const cantidadPersonas = document.getElementById("cantidad-personas");
      cantidadPersonas!.textContent = `Cantidad de personas: ${data.length}`;

      asistentesContainer!.innerHTML = "";
      data.forEach((persona: any) => {
        const personaHTML = renderPersonaItem(persona);
        asistentesContainer!.appendChild(personaHTML);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      asistentesContainer!.innerHTML = "";
    });
};

const renderPlanilla = (planillas: IPlanilla[], planillaSeleccionadaId: string) => {
  const descripcion = document.getElementById("descripcion");
  const ubicacion = document.getElementById("ubicacion");
  const minTolerancia = document.getElementById("min-tolerancia");
  const horaIngreso = document.getElementById("hora-ingreso");
  const horaSalida = document.getElementById("hora-salida");
  const fecha = document.getElementById("fecha");

  planillas.forEach((planilla: any) => {
    const planillaModel = planilla.fields;
    const planillaModelId = planilla.pk;

    if (planillaModelId == planillaSeleccionadaId) {
      ubicacion!.textContent = "🌎 " + planillaModel.ubicacion;
      descripcion!.textContent = planillaModel.descripcion;
      minTolerancia!.textContent = planillaModel.min_tolerancia;
      horaIngreso!.textContent = planillaModel.hora_ingreso.substring(0, 5);
      horaSalida!.textContent = planillaModel.hora_salida.substring(0, 5);
      const fechaActualizada = new Date(planillaModel.fecha);
      fechaActualizada.setDate(fechaActualizada.getDate() + 1);
      fecha!.textContent = fechaActualizada.toLocaleDateString("es-BO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const planillas = JSON.parse(localStorage.getItem(KEY_PLANILLAS) || "[]");
  const planillaIdLocalStorage = localStorage.getItem(
    KEY_PLANILLA_SELECCIONADA
  );

  const botonesEstado = document.querySelectorAll("button[data-estado]");
  botonesEstado.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      const estado = (event.target as HTMLButtonElement).getAttribute("data-estado") || "P";
      mostrarListaAsistencia(estado);
    });
  });

  renderPlanilla(planillas, planillaIdLocalStorage || "0");
});

