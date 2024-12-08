// You'll need to get an API key from Google Cloud Console
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface AddressComponent {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  placeId: string;
}

export async function getAddressSuggestions(input: string): Promise<AddressComponent[]> {
  if (!input || input.length < 3) return [];

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=address&components=country:us&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    
    if (!data.predictions) return [];

    const suggestions = await Promise.all(
      data.predictions.map(async (prediction: any) => {
        const details = await getPlaceDetails(prediction.place_id);
        return {
          address: details.street_address || prediction.description,
          city: details.city,
          state: details.state,
          zipCode: details.postal_code,
          placeId: prediction.place_id
        };
      })
    );

    return suggestions;
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}

async function getPlaceDetails(placeId: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    
    if (!data.result) return {};

    const components = data.result.address_components;
    let details: any = {};

    components.forEach((component: any) => {
      const types = component.types;

      if (types.includes('street_number') || types.includes('route')) {
        details.street_address = details.street_address 
          ? `${details.street_address} ${component.long_name}`
          : component.long_name;
      }
      if (types.includes('locality')) details.city = component.long_name;
      if (types.includes('administrative_area_level_1')) details.state = component.short_name;
      if (types.includes('postal_code')) details.postal_code = component.long_name;
    });

    return details;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
}
