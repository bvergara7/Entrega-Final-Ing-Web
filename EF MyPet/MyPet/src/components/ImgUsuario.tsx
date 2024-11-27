import React from 'react';
import './ImgUsuario.css';  // Crearemos este archivo de estilos

interface ImgUsuarioProps {
  currentImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ImgUsuario: React.FC<ImgUsuarioProps> = ({
  currentImage,
  onImageSelect,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const predefinedImages = [
    'https://res.cloudinary.com/dltokeplx/image/upload/fl_preserve_transparency/v1731884265/Img4_crozaq.jpg',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731884265/Img1_k8nq54.png',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731884265/Img3_ofb42s.png',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731884265/Img2_poa5un.png',
    'https://res.cloudinary.com/dltokeplx/image/upload/v1731884264/31ec2ce212492e600b8de27f38846ed7_kifevn.jpg'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Selecciona tu imagen de perfil</h2>
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

export default ImgUsuario;



