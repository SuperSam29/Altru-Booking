export const PROPERTY_DATA = {
  id: "prop123",
  title: "Stunning 2 Bed with Private Pool in Tranquil Arpora",
  location: {
    city: "Arpora",
    state: "Goa",
    country: "India",
    description:
      "Located in the heart of Arpora, close to famous beaches and nightlife.",
    coordinates: { lat: 15.5615, lng: 73.7641 },
  },
  details: {
    type: "Entire villa",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
  },
  images: [
    { id: 1, url: "/Images/fa41863c-3bc2-4d72-a201-15fa2562dee1.avif", alt: "Property Image 1" },
    { id: 2, url: "/Images/ce1a4454-3fdf-4b6b-81b8-237937478f55 (1).webp", alt: "Property Image 2" },
    { id: 3, url: "/Images/88e6a511-cab5-4f43-a83f-192a4117c0e3.webp", alt: "Property Image 3" },
    { id: 4, url: "/Images/e182e7e0-557c-4346-93a2-43205b45eb49.webp", alt: "Property Image 4" },
    { id: 5, url: "/Images/9190a5d5-c42f-474e-b740-62ae3430deb5.webp", alt: "Property Image 5" },
  ],
  pricing: {
    basePrice: 4500,
    currency: "₹",
    includesFees: true,
  },
  amenities: {
    bathroom: [
      "Hair dryer",
      "Cleaning products",
      "Shampoo",
      "Conditioner",
      "Body soap",
      "Hot water",
      "Shower gel",
    ],

    bedroomAndLaundry: [
      "Washing machine",
      "Dryer – In unit",
      "Hangers",
      "Bed linen",
      "Cotton linen",
      "Extra pillows and blankets",
      "Iron",
      "Clothes drying rack",
      "Safe",
      "Clothes storage: wardrobe and chest of drawers",
    ],

    entertainment: ["TV", "Books and reading material"],
    family: ["Board games"],
    heatingAndCooling: ["Air conditioning", "Ceiling fan", "Heating"],
    internetAndOffice: ["Wifi", "Dedicated workspace"],
    kitchenAndDining: [
      "Kitchen",
      "Space where guests can cook their own meals",
      "Fridge",
      "Microwave",
      "Cooking basics",
      "Pots and pans, oil, salt and pepper",
      "Dishes and cutlery",
      "Bowls, chopsticks, plates, cups, etc.",
      "Freezer",
      "Kettle",
      "Toaster",
    ],

    locationFeatures: ["Launderette nearby"],
    outdoor: [
      "Shared back garden",
      "An open space on the property usually covered in grass",
      "Outdoor furniture",
      "Outdoor dining area",
      "Sun loungers",
    ],

    parkingAndFacilities: ["Free parking on premises", "Pool"],
    services: [
      "Long-term stays allowed",
      "Allow stays of 28 days or more",
      "Self check-in",
      "Lockbox",
      "Cleaning available during stay",
    ],
  },
  unavailableAmenities: [
    "Exterior security cameras on property",
    "Essentials",
    "Smoke alarm",
    "Carbon monoxide alarm",
  ],

  unavailableNotes: {
    "Smoke alarm":
      "This place may not have a smoke detector. Contact the host with any questions.",
    "Carbon monoxide alarm":
      "This place may not have a carbon monoxide detector. Contact the host with any questions.",
  },
  highlightedAmenities: [
    "Kitchen",
    "Wifi",
    "Dedicated workspace",
    "Free parking on premises",
    "Pool",
    "TV",
    "Washing machine",
    "Dryer – In unit",
  ],
};
