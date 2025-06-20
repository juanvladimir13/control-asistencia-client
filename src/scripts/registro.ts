import { API_URL } from "astro:env/client";

import { KEY_PLANILLA_SELECCIONADA, KEY_PLANILLAS } from "@datatypes/data";
import type { IPlanilla, ITutor } from "@datatypes/datatypes";

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

const getAsistenciaData = () => {
  const rfidInput = document.getElementById("rfid-input") as HTMLInputElement;
  const rfidValue = rfidInput.value.trim();
  const planillaIdValue =
    localStorage.getItem(KEY_PLANILLA_SELECCIONADA) || 0;
  const tipoElement = document.querySelector(
    'input[name="tipo"]:checked',
  ) as HTMLInputElement;

  const tipoValue = tipoElement.value || "I";

  return {
    planilla_id: planillaIdValue,
    rfid: rfidValue,
    tipo: tipoValue,
  };
};

const mostrarPersonaRegistrada = (tutor: ITutor) => {
  const asistenteData = document.getElementById("asistente-data") as HTMLParagraphElement;
  asistenteData!.textContent = tutor
    ? `${tutor.nombres} ${tutor.apellidos}`
    : "...";
};

const limpiarDatos = () => {
  const asistenteData = document.getElementById("asistente-data") as HTMLParagraphElement;
  const rfidInput = document.getElementById("rfid-input") as HTMLInputElement;

  setTimeout(() => {
    rfidInput.value = "";
    asistenteData!.textContent = "...";
    rfidInput.focus();
  }, 1500);
};

const fetchMarcarAsistencia = (url: string, data: any) => {
  fetch(
    `${API_URL}${url}?planilla_id=${data.planilla_id}&rfid=${data.rfid}&tipo=${data.tipo}`,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      mostrarPersonaRegistrada(data.tutor);
      limpiarDatos();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      const asistenteData = document.getElementById("asistente-data") as HTMLParagraphElement;
      asistenteData!.textContent = "Error";
      limpiarDatos();
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const rfidInput = document.getElementById("rfid-input") as HTMLInputElement;
  rfidInput!.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchMarcarAsistencia("/api/asistencia", getAsistenciaData());
    }
  });

  const eventos = document.querySelectorAll("input[type=radio]");
  eventos.forEach((input) => {
    input.addEventListener("change", () => {
      rfidInput.focus();
    });
  });

  const planillas = JSON.parse(localStorage.getItem(KEY_PLANILLAS) || "[]");
  const planillaIdLocalStorage = localStorage.getItem(
    KEY_PLANILLA_SELECCIONADA,
  );

  renderPlanilla(planillas, planillaIdLocalStorage || "0");
});