import React, { useState } from 'react';

const Cloudinary = () => {
    const preset_name = "masc123";  // Preset configurado en Cloudinary
    const cloud_name = "dltokeplx"; // Tu cloud name en Cloudinary

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data,
            });

            const file = await response.json();
            setImage(file.secure_url);
            setLoading(false);

            // Llama a la función para guardar la URL en la base de datos asociada al usuario
            await saveImageToDatabase(file.secure_url);
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }
    };

    const saveImageToDatabase = async (url) => {
        try {
            const response = await fetch("http://localhost:3000/usuario/:id", {
                method: "PUT", // PUT porque estás actualizando un usuario existente
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Token JWT si es necesario
                },
                body: JSON.stringify({ fotoPerfil: url }), // Solo envía la URL de la imagen
            });

            if (response.ok) {
                alert("Imagen asociada al usuario correctamente");
            } else {
                console.error("Error al asociar la imagen al usuario");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h1>Subir Imagen de Perfil</h1>
            <input
                type="file"
                name="file"
                placeholder="Upload an image"
                onChange={(e) => uploadImage(e)}
            />
            {loading ? (
                <h3>Cargando...</h3>
            ) : (
                image && <img src={image} alt="Imagen subida" />
            )}
        </div>
    );
};

export default Cloudinary;
