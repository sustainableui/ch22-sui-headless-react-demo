import AZURE_REGIONS from '../../../pages/api/azure-regions.json';

const R = 6371e3;

export default async function calculateCarbonIntensity(cords) {
  const closestAzureRegion = getClosestAzureRegion({ lat: cords.lat, lon: cords.lon }, AZURE_REGIONS);

  const res = await fetch(
    `https://carbon-aware-api.azurewebsites.net/emissions/bylocation?location=${closestAzureRegion}`,
  );
  return res.json();
}

function getClosestAzureRegion(userCoords, azureRegions) {
  const azureRegionsDistances = azureRegions.map(azureRegion =>
    distance(userCoords, {
      lat: azureRegion.Latitude,
      lon: azureRegion.Longitude,
    }),
  );

  const closestAzureRegionDistance = Math.min(...azureRegionsDistances);

  const closestAzureRegionIndex = azureRegionsDistances.findIndex(
    azureRegionsDistance => azureRegionsDistance === closestAzureRegionDistance,
  );

  return azureRegions[closestAzureRegionIndex].RegionName;
}

function distance({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  return Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
}
