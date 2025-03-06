export const API_URL = "http://localhost:1337/api";
export const URL = "http://localhost:1337";

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
