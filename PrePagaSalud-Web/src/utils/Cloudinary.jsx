// Función para subir la imagen a Cloudinary
export async function subirACloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/dd5wwu8st/upload`;
    const preset = "prepaga_salud";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(url, {
    method: "POST",
    body: formData,
    });

    if (!res.ok) throw new Error("Error al subir la imagen");

    const data = await res.json();
    return data.secure_url;
}