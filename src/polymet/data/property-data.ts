export const PROPERTY_DATA = {
  id: "prop123",
  title: "2BHK Duplex Flat | Near Baga - Calangute Beach",
  location: {
    city: "Arpora",
    state: "Goa",
    country: "India",
    description: "Exact location provided after booking.",
    coordinates: {
      lat: 15.5685,
      lng: 73.7494,
    },
  },
  details: {
    type: "Entire apartment",
    guests: 5,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
  },
  pricing: {
    basePrice: 4500,
    currency: "₹",
    includesFees: true,
  },
  images: [
    {
      id: 1,
      url: "https://picsum.photos/seed/property1/800/600",
      alt: "Living room with orange sofa and wooden coffee table",
    },
    {
      id: 2,
      url: "https://picsum.photos/seed/property2/800/600",
      alt: "Modern bathroom with bathtub",
    },
    {
      id: 3,
      url: "https://picsum.photos/seed/property3/800/600",
      alt: "Garden pathway",
    },
    {
      id: 4,
      url: "https://picsum.photos/seed/property4/800/600",
      alt: "Bedroom with window",
    },
    {
      id: 5,
      url: "https://picsum.photos/seed/property5/800/600",
      alt: "Kitchen area",
    },
  ],

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
