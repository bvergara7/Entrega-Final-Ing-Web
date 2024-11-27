// services/authService.ts
interface UserData {
    id: number;
    nombre: string;
    email: string;
    fotoPerfil?: string;
    idRegion: string;
    nombreRegion?: string;
  }
  
  export const updateUserData = async (token: string): Promise<UserData | null> => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id;
  
      const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('currentUserData', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      return null;
    }
  };
  
  export const getUserData = (): UserData | null => {
    const userData = localStorage.getItem('currentUserData');
    return userData ? JSON.parse(userData) : null;
  };