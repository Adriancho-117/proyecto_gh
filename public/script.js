export async function fetchAct(actId) {
  try {
    const res = await fetch(`/api/actos/${actId}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`El servidor respondió con el estado ${res.status}.`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al solicitar el Acto ${actId}:`, error);
    throw new Error(
      `No se pudo cargar el Acto ${actId}. Verifica tu conexión e inténtalo de nuevo.`,
      { cause: error }
    );
  }
}
