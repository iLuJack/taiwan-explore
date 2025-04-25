// data/locations.ts
export interface Location {
    id: number;
    name: string;
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    description?: string;
  }
  
  export const taiwanLocations: Location[] = [
    {
      id: 1,
      name: "Jiufen Old Street",
      lat: 25.1091,
      lng: 121.8443,
      heading: 55,
      pitch: 0,
      description: "Famous mountainside town that inspired Spirited Away"
    },
    {
      id: 2,
      name: "Taroko Gorge",
      lat: 24.1587,
      lng: 121.6219,
      heading: 90,
      pitch: 0,
      description: "Spectacular marble canyon with winding roads"
    },
    {
      id: 3,
      name: "Sun Moon Lake",
      lat: 23.8496,
      lng: 120.9153,
      heading: 180,
      pitch: 0,
      description: "Taiwan's largest natural lake surrounded by mountains"
    },
    {
      id: 4, 
      name: "Taipei 101 View",
      lat: 25.0336,
      lng: 121.5644,
      heading: 270,
      pitch: 10,
      description: "View of Taiwan's iconic skyscraper"
    },
    {
      id: 5,
      name: "Alishan Forest Railway",
      lat: 23.5118, 
      lng: 120.8039,
      heading: 0,
      pitch: 0,
      description: "Historic mountain railway through cypress forests"
    }
  ];