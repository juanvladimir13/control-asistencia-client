import { API_URL } from "astro:env/client";

import type { IPlanilla } from "@datatypes/datatypes";
import { KEY_PLANILLA_SELECCIONADA, KEY_PLANILLAS } from "@datatypes/data";

const renderPlanilla = (planilla: IPlanilla, pk: number) => {
  const fechaActualizada = new Date(planilla.fecha);
  fechaActualizada.setDate(fechaActualizada.getDate() + 1);

  const planillaHTML = document.createElement("div");
  planillaHTML.classList.add("card", "mb-3");
  planillaHTML.innerHTML = `
  <div class="card-body">
  <h5 class="card-title">${planilla.descripcion}</h5>
  <h6 class="card-subtitle mb-2 text-body-secondary">🌎 ${planilla.ubicacion}</h6>
  <p class="info-item mb-0">
    <span class="icon">📅</span>
    <span class="text"><strong>${fechaActualizada.toLocaleDateString('es-BO', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}</strong></span>
  </p>
  <p class="info-item mb-0">
    <span class="icon">🕒</span>
    <span class="text"><strong>Ingreso:</strong> ${planilla.hora_ingreso.substring(0, 5)}</span>
  </p>
  <p class="info-item mb-0">
    <span class="icon">🕒</span>
    <span class="text"><strong>Salida:</strong> ${planilla.hora_salida.substring(0, 5)}</span>
  </p>
  <p class="info-item mb-0">
    <span class="icon">⏱️</span>
    <span class="text"><strong>Tolerancia:</strong> ${planilla.min_tolerancia} min</span>
  </p>

  <div class="d-grid mt-3">
    <button class="btn btn-outline-primary" data-pk="${pk}">
        Registrar
    </button>
  </div>
</div>
  `;
  return planillaHTML;
};

const renderPlanillas = (planillas: IPlanilla[]) => {
  const planillaContainer = document.getElementById("planillas-container");
  planillaContainer!.innerHTML = "";

  planillas.forEach((planilla: any) => {
    const planillaHTML = renderPlanilla(planilla.fields, planilla.pk);
    planillaContainer!.appendChild(planillaHTML);
  });

  addEnvetListenerPlanillaItem();
}

const guardarPlanillaSeleccionada = (htmlElement: any) => {
  const element = htmlElement.target;
  const pk = element.getAttribute("data-pk") || 0;
  localStorage.setItem(KEY_PLANILLA_SELECCIONADA, pk);
  window.location.href = "/registro";
};

const fetchPlanillas = (url: string) => {
  fetch(`${API_URL}${url}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const planillas = JSON.parse(data);
      localStorage.setItem(KEY_PLANILLAS, JSON.stringify(planillas));

      renderPlanillas(planillas);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

const addEnvetListenerPlanillaItem = () => {
  const buttons = document.querySelectorAll("button[data-pk]");
  buttons.forEach((button) => {
    button.addEventListener("click", guardarPlanillaSeleccionada);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  fetchPlanillas("/api/planillas");
});