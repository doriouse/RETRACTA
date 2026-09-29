const API_URL = "http://127.0.0.1:8000";

export async function getStatus() {
  const response = await fetch(`${API_URL}/status`);

  if (!response.ok) {
    throw new Error("Não foi possível obter o status do RETRACTA.");
  }

  return response.json();
}

export async function getDecision() {
  const response = await fetch(`${API_URL}/decision`);

  if (!response.ok) {
    throw new Error("Não foi possível obter a decisão do RETRACTA.");
  }

  return response.json();
}

export async function retractClothesline() {
  const response = await fetch(`${API_URL}/clothesline/retract`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Não foi possível recolher o varal.");
  }

  return response.json();
}

export async function openClothesline() {
  const response = await fetch(`${API_URL}/clothesline/open`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Não foi possível abrir o varal.");
  }

  return response.json();
}

export async function activateAutomaticMode() {
  const response = await fetch(`${API_URL}/system/auto`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Não foi possível ativar o modo automático.");
  }

  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error("Não foi possível obter o histórico do RETRACTA.");
  }

  return response.json();
}

export async function getMetrics() {
  const response = await fetch(`${API_URL}/metrics`);

  if (!response.ok) {
    throw new Error("Não foi possível obter as métricas do RETRACTA.");
  }

  return response.json();
}