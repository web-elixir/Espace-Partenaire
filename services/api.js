import axios from 'axios';

export const API_URL = "https://www.strapi.plan-etudiant-besancon.com/api"; 
export const URL = "https://www.strapi.plan-etudiant-besancon.com"; 

export const createPartner = async (partnerData) => {
    const formData = new FormData();

    Object.keys(partnerData).forEach((key) => {
        if (partnerData[key]) {
            formData.append(`data[${key}]`, partnerData[key]);
        }
    });
    if (partnerData.image instanceof File) {
        formData.append("files.image", partnerData.image);
    }
    try {
        const response = await fetch(`${API_URL}/partners`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur de réponse :", errorData); // Log de l'erreur
            throw new Error(errorData.error.message || "Erreur lors de la création du partenaire");
        }

        const responseData = await response.json();
        console.log("Réponse de l'API :", responseData); // Log de la réponse
        return responseData;
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
};


export const incrementUserPoints = async (userId) => {
  try {
    // Récupérer d'abord les points actuels
    const currentUser = await axios.get(`${API_URL}/users/${userId}`);
    const currentPoints = currentUser.data.point || 0;
    
    // Mettre à jour avec le nouveau total
    const response = await axios.put(`${API_URL}/users/${userId}`, {
      point: currentPoints + 1
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error; // Propager l'erreur pour la gérer dans le composant
  }
};


