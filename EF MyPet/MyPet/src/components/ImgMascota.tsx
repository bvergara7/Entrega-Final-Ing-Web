import React from 'react';
import './ImgMascota.css';  // Crearemos este archivo de estilos

interface ImgUsuarioProps {
  currentImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ImgMascota: React.FC<ImgUsuarioProps> = ({
  currentImage,
  onImageSelect,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const predefinedImages = [
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967281/Pitbull_mlpzdt.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967281/Husky_cbn5yh.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Pastor_Aleman_baawi9.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Golden_zugrrt.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/San_Bernardo_a3ekfw.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Chow_chow_g5hgad.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Bulldog_hbz08e.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Boxer_b8uqad.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731967280/Gran_Dan%C3%A9s_lyzzc9.jpg'
    

    
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Selecciona tu imagen de Mascota</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <div className="image-grid">
          {predefinedImages.map((imageUrl, index) => (
            <div 
              key={index}
              className={`image-card ${currentImage === imageUrl ? 'selected' : ''}`}
              onClick={() => {
                onImageSelect(imageUrl);
                onClose();
              }}
            >
              <div className="image-container">
                <img 
                  src={imageUrl}
                  alt={`Opción ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImgMascota;



