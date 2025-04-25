<!-- components/StreetView.vue -->
<template>
    <div>
      <div id="street-view" class="street-view-container"></div>
      <div class="controls">
        <button @click="shareLocation" class="control-btn share-btn">
          <span class="icon">🔗</span> Share
        </button>
        <button @click="nextLocation" class="control-btn next-btn">
          <span class="icon">➡️</span> Next Location
        </button>
      </div>
      <div v-if="currentLocation" class="location-info">
        <h3>{{ currentLocation.name }}</h3>
        <p>{{ currentLocation.description }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  import { taiwanLocations } from '~/data/locations';
  
  const props = defineProps({
    initialLocationId: {
      type: Number,
      default: null
    }
  });
  
  const config = useRuntimeConfig();
  const panorama = ref<google.maps.StreetViewPanorama | null>(null);
  const locationIndex = ref(0);
  const currentLocation = computed(() => taiwanLocations[locationIndex.value]);
  
  const findLocationIndexById = (id: number) => {
    return taiwanLocations.findIndex(loc => loc.id === id);
  };
  
  const initStreetView = async () => {
    if (!config.public.googleMapsApiKey) {
      console.error("Google Maps API key is missing");
      return;
    }
  
    const loader = new Loader({
      apiKey: config.public.googleMapsApiKey,
      version: "weekly",
      libraries: ["places"]
    });
  
    try {
      await loader.load();
      
      const streetViewElement = document.getElementById("street-view");
      if (!streetViewElement) {
        console.error("Street View container not found");
        return;
      }
      
      // Create a Street View service to check for panorama data
      const streetViewService = new google.maps.StreetViewService();
      
      // Check if there's Street View data at this location
      try {
        const response = await streetViewService.getPanorama({
          location: {
            lat: currentLocation.value.lat,
            lng: currentLocation.value.lng
          },
          radius: 50 // Look within 50 meters
        });
        
        // If we have data, create the panorama
        if (response && response.data && response.data.location) {
          console.log("Found Street View panorama:", response.data.location);
          
          panorama.value = new google.maps.StreetViewPanorama(
            streetViewElement,
            {
              pano: response.data.location.pano,
              pov: { 
                heading: currentLocation.value.heading, 
                pitch: currentLocation.value.pitch 
              },
              zoom: 1,
              addressControl: true,
              addressControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER
              },
              enableCloseButton: false,
              fullscreenControl: true,
              linksControl: true,
              panControl: true,
              motionTrackingControl: true,
              motionTrackingControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
              },
              visible: true
            }
          );
          
          // Add listeners
          panorama.value.addListener("pov_changed", () => {
            console.log("POV changed:", panorama.value?.getPov());
          });
          
          panorama.value.addListener("position_changed", () => {
            console.log("Position changed:", panorama.value?.getPosition());
          });
        } else {
          console.error("No Street View data found at this location");
          // Display an error message to the user
          streetViewElement.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: #f8f9fa;">
              <div style="text-align: center; padding: 20px;">
                <h3>No Street View Available</h3>
                <p>Unfortunately, there is no Street View data available for ${currentLocation.value.name}.</p>
                <button onclick="window.location.reload()" class="control-btn">Try Another Location</button>
              </div>
            </div>
          `;
        }
      } catch (error) {
        console.error("Street View service error:", error);
        streetViewElement.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: #f8f9fa;">
            <div style="text-align: center; padding: 20px;">
              <h3>Street View Error</h3>
              <p>Something went wrong while loading Street View data.</p>
              <button onclick="window.location.reload()" class="control-btn">Try Again</button>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
    }
  };
  
  const nextLocation = () => {
    locationIndex.value = (locationIndex.value + 1) % taiwanLocations.length;
    if (panorama.value) {
      panorama.value.setPosition({ 
        lat: currentLocation.value.lat, 
        lng: currentLocation.value.lng 
      });
      panorama.value.setPov({ 
        heading: currentLocation.value.heading, 
        pitch: currentLocation.value.pitch 
      });
    }
  };
  
  const getRandomLocation = () => {
    return Math.floor(Math.random() * taiwanLocations.length);
  };
  
  onMounted(() => {
    if (props.initialLocationId) {
      const index = findLocationIndexById(props.initialLocationId);
      if (index !== -1) {
        locationIndex.value = index;
      } else {
        locationIndex.value = getRandomLocation();
      }
    } else {
      locationIndex.value = getRandomLocation();
    }
    
    initStreetView();
  });
  
  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: `Taiwan Explorer - ${currentLocation.value.name}`,
        text: `Check out this beautiful view of ${currentLocation.value.name} in Taiwan!`,
        url: `${window.location.origin}?location=${currentLocation.value.id}`
      }).catch(error => console.error('Error sharing:', error));
    } else {
      const shareUrl = `${window.location.origin}?location=${currentLocation.value.id}`;
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying link:', err));
    }
  };
  </script>
  
  <style scoped>
  .street-view-container {
    width: 100%;
    height: 80vh;
    position: relative;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  .control-btn {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #4285F4;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
  }
  
  .control-btn:hover {
    background-color: #3367D6;
  }
  
  .next-btn {
    background-color: #34A853;
  }
  
  .next-btn:hover {
    background-color: #2E8B57;
  }
  
  .location-info {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.9);
    border-top: 1px solid #eee;
  }
  
  .icon {
    font-size: 1.2rem;
  }
  </style>