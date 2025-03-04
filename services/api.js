const API_URL = "http://localhost:1337/api";


export const createPartner = async (partnerData) => {
    const requestBody = {
      data: {
        ...partnerData,
      }
    };

    console.log("Données testées :", JSON.stringify(requestBody, null, 2));
  
    try {
      const response = await fetch(`${API_URL}/partners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Données envoyées :", requestBody); 
  
      if (!response.ok) {
        throw new Error("Erreur lors de la création du partenaire");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  };
  