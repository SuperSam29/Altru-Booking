import { MapIcon, SearchIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyLocationMapFallbackProps {
  location: {
    city: string;
    state: string;
    country: string;
    description: string;
  };
  googleMapsUrl?: string;
}

export default function PropertyLocationMapFallback({
  location,
  googleMapsUrl = "https://maps.app.goo.gl/S9e4x7NnxkBhvEQ28",
}: PropertyLocationMapFallbackProps) {
  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div
      className="space-y-4"
      data-pol-id="4dl64o"
      data-pol-file-name="property-location-map-fallback"
      data-pol-file-type="component"
    >
      <h2
        className="text-xl font-semibold"
        data-pol-id="w8hapm"
        data-pol-file-name="property-location-map-fallback"
        data-pol-file-type="component"
      >
        Where you'll be
      </h2>
      <p
        className="text-muted-foreground"
        data-pol-id="wy7yy2"
        data-pol-file-name="property-location-map-fallback"
        data-pol-file-type="component"
      >
        {location.city}, {location.state}, {location.country}
      </p>

      <div
        className="relative w-full h-[300px] md:h-[400px] bg-muted rounded-lg overflow-hidden"
        data-pol-id="mcr24t"
        data-pol-file-name="property-location-map-fallback"
        data-pol-file-type="component"
      >
        {/* Map placeholder - used when Google Maps API is not available */}
        <div
          className="absolute inset-0 bg-[#e0e7ff] overflow-hidden"
          data-pol-id="jfxohk"
          data-pol-file-name="property-location-map-fallback"
          data-pol-file-type="component"
        >
          <div
            className="absolute inset-0 opacity-10"
            data-pol-id="1x7mdz"
            data-pol-file-name="property-location-map-fallback"
            data-pol-file-type="component"
          >
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-red-500 opacity-20"
              data-pol-id="hk8o5s"
              data-pol-file-name="property-location-map-fallback"
              data-pol-file-type="component"
            ></div>
            <div
              className="grid grid-cols-8 grid-rows-8 h-full w-full"
              data-pol-id="e72uh4"
              data-pol-file-name="property-location-map-fallback"
              data-pol-file-type="component"
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-blue-200"
                  data-pol-id={`ajhodl_${i}`}
                  data-pol-file-name="property-location-map-fallback"
                  data-pol-file-type="component"
                ></div>
              ))}
            </div>
          </div>

          {/* Location pin */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            data-pol-id="c4wjj1"
            data-pol-file-name="property-location-map-fallback"
            data-pol-file-type="component"
          >
            <div
              className="relative"
              data-pol-id="pagvlf"
              data-pol-file-name="property-location-map-fallback"
              data-pol-file-type="component"
            >
              <div
                className="absolute -top-6 -left-6 w-12 h-12 bg-red-500 rounded-full opacity-20 animate-pulse"
                data-pol-id="mzcelw"
                data-pol-file-name="property-location-map-fallback"
                data-pol-file-type="component"
              ></div>
              <div
                className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full"
                data-pol-id="vk1wse"
                data-pol-file-name="property-location-map-fallback"
                data-pol-file-type="component"
              ></div>
            </div>
          </div>

          {/* Map controls */}
          <div
            className="absolute top-4 left-4 flex flex-col gap-2"
            data-pol-id="tcx08o"
            data-pol-file-name="property-location-map-fallback"
            data-pol-file-type="component"
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={handleOpenGoogleMaps}
              data-pol-id="yeo4r3"
              data-pol-file-name="property-location-map-fallback"
              data-pol-file-type="component"
            >
              <MapIcon
                className="h-4 w-4"
                data-pol-id="qcer8p"
                data-pol-file-name="property-location-map-fallback"
                data-pol-file-type="component"
              />
            </Button>
          </div>

          {/* Map attribution */}
          <div
            className="absolute bottom-1 right-1 text-[10px] text-gray-500"
            data-pol-id="m3ib6k"
            data-pol-file-name="property-location-map-fallback"
            data-pol-file-type="component"
          >
            Map data ©{new Date().getFullYear()}
          </div>
        </div>
      </div>

      <div
        className="text-sm"
        data-pol-id="mi043y"
        data-pol-file-name="property-location-map-fallback"
        data-pol-file-type="component"
      >
        <p
          className="font-medium"
          data-pol-id="lw6vun"
          data-pol-file-name="property-location-map-fallback"
          data-pol-file-type="component"
        >
          {location.description}
        </p>
      </div>
    </div>
  );
}
