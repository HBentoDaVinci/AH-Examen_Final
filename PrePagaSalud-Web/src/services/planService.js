const host = import.meta.env.VITE_API_URL;

/**
 * Obtener un plan por su ID
 */
export async function getPlanById(id) {
    const response = await fetch(`${host}/planes/${id}`);
    if (!response.ok) throw new Error("No se pudo obtener el plan");
    const { data } = await response.json();
    return data;
}

/**
 * Obtener todos los planes (opcionalmente con filtros)
 */
export async function getPlanes(filtros = {}) {
    const query = new URLSearchParams(filtros).toString();
    const response = await fetch(`${host}/planes?${query}`);
    if (!response.ok) throw new Error("Error al obtener los planes");
    const { data } = await response.json();
    return data;
}

/**
 * Crear un nuevo plan
 */
export async function createPlan(planData, token) {
    const formData = new FormData();
    for (const key in planData) {
        formData.append(key, planData[key]);
    }

    const response = await fetch(`${host}/planes`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al crear el plan");
    }

    const { data } = await response.json();
    return data;
}

/**
 * Actualizar un plan existente
 */
export async function updatePlan(id, planData, token) {
    const formData = new FormData();
    for (const key in planData) {
        formData.append(key, planData[key]);
    }

    const response = await fetch(`${host}/planes/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al actualizar el plan");
    }

    const { data } = await response.json();
    return data;
}

/**
 * Eliminar un plan
 */
export async function deletePlan(id, token) {
    const response = await fetch(`${host}/planes/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al eliminar el plan");
    }

    return true;
}
