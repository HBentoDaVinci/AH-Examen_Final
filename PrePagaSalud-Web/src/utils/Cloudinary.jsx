// Función para subir la imagen a Cloudinary
export async function subirACloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const baseUrl = import.meta.env.VITE_CLOUDINARY_URL;

    const url = `${baseUrl}/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(url, {
    method: "POST",
    body: formData,
    });

    if (!res.ok) throw new Error("Error al subir la imagen");

    const data = await res.json();
    return data.secure_url;
}