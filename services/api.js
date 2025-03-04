const API_URL = "http://localhost:1337/api";

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
            throw new Error(errorData.error.message || "Erreur lors de la création du partenaire");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
};
