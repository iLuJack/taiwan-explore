<!-- pages/index.vue -->
<template>
    <div class="container">
      <header>
        <h1>Taiwan Explorer</h1>
        <p>Discover beautiful places around Taiwan through immersive Street View</p>
      </header>
      
      <main>
        <ClientOnly>
          <StreetView :initialLocationId="locationId" />
        </ClientOnly>
      </main>
      
      <footer>
        <p>© {{ new Date().getFullYear() }} Taiwan Explorer</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const locationId = ref(null);
  
  onMounted(() => {
    // Check if a specific location was requested in the URL
    if (route.query.location) {
      locationId.value = parseInt(route.query.location);
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    color: #4285F4;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  footer {
    margin-top: 2rem;
    text-align: center;
    color: #666;
    padding: 1rem 0;
    border-top: 1px solid #eee;
  }
  </style>