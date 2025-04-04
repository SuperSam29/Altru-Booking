"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertOctagonIcon,
  BathIcon,
  BedIcon,
  BookIcon,
  CheckIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  UtensilsIcon,
  MapPinIcon,
  MonitorIcon,
  CarIcon,
  ShirtIcon,
  SunIcon,
  ThermometerIcon,
  WifiIcon,
  XIcon,
} from "lucide-react";

interface AmenitiesProps {
  amenities: Record<string, string[]>;
  unavailableAmenities: string[];
  unavailableNotes: Record<string, string>;
  highlightedAmenities: string[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bathroom: (
    <BathIcon
      className="h-5 w-5"
      data-pol-id="vvba5b"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  bedroomAndLaundry: (
    <BedIcon
      className="h-5 w-5"
      data-pol-id="29lp0u"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  entertainment: (
    <MonitorIcon
      className="h-5 w-5"
      data-pol-id="epl91c"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  family: (
    <HeartIcon
      className="h-5 w-5"
      data-pol-id="e6rp10"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  heatingAndCooling: (
    <ThermometerIcon
      className="h-5 w-5"
      data-pol-id="tmm9ha"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),

  internetAndOffice: (
    <WifiIcon
      className="h-5 w-5"
      data-pol-id="oj5tk7"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  kitchenAndDining: (
    <UtensilsIcon
      className="h-5 w-5"
      data-pol-id="cdmtf9"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  locationFeatures: (
    <MapPinIcon
      className="h-5 w-5"
      data-pol-id="516jel"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  outdoor: (
    <SunIcon
      className="h-5 w-5"
      data-pol-id="xoixwe"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  parkingAndFacilities: (
    <CarIcon
      className="h-5 w-5"
      data-pol-id="nycfsl"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
  services: (
    <GlobeIcon
      className="h-5 w-5"
      data-pol-id="zegv9x"
      data-pol-file-name="property-amenities-list"
      data-pol-file-type="component"
    />
  ),
};

const CATEGORY_TITLES: Record<string, string> = {
  bathroom: "Bathroom",
  bedroomAndLaundry: "Bedroom and laundry",
  entertainment: "Entertainment",
  family: "Family",
  heatingAndCooling: "Heating and cooling",
  internetAndOffice: "Internet and office",
  kitchenAndDining: "Kitchen and dining",
  locationFeatures: "Location features",
  outdoor: "Outdoor",
  parkingAndFacilities: "Parking and facilities",
  services: "Services",
};

export default function PropertyAmenitiesList({
  amenities,
  unavailableAmenities,
  unavailableNotes,
  highlightedAmenities,
}: AmenitiesProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Get the icon for a specific amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "Kitchen":
        return (
          <UtensilsIcon
            className="h-5 w-5"
            data-pol-id="m84ixf"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Wifi":
        return (
          <WifiIcon
            className="h-5 w-5"
            data-pol-id="9qihs4"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Dedicated workspace":
        return (
          <HomeIcon
            className="h-5 w-5"
            data-pol-id="qjxgl9"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Free parking on premises":
        return (
          <CarIcon
            className="h-5 w-5"
            data-pol-id="ywch8l"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Pool":
        return (
          <WifiIcon
            className="h-5 w-5"
            data-pol-id="pqm5nf"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "TV":
        return (
          <MonitorIcon
            className="h-5 w-5"
            data-pol-id="36m5t1"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Washing machine":
        return (
          <ShirtIcon
            className="h-5 w-5"
            data-pol-id="ubtygc"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      case "Dryer – In unit":
        return (
          <ShirtIcon
            className="h-5 w-5"
            data-pol-id="59cn5p"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
      default:
        return (
          <CheckIcon
            className="h-5 w-5"
            data-pol-id="xtijh8"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          />
        );
    }
  };

  return (
    <>
      <div
        className="space-y-6"
        data-pol-id="jzk29o"
        data-pol-file-name="property-amenities-list"
        data-pol-file-type="component"
      >
        <div
          data-pol-id="mwuco3"
          data-pol-file-name="property-amenities-list"
          data-pol-file-type="component"
        >
          <h2
            className="text-xl font-semibold mb-4"
            data-pol-id="0om7tc"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          >
            What this place offers
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-pol-id="4h1ky4"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          >
            {highlightedAmenities.map((amenity, index) => (
              <div
                key={amenity}
                className="flex items-center gap-3"
                data-pol-id={`r7v62g_${index}`}
                data-pol-file-name="property-amenities-list"
                data-pol-file-type="component"
              >
                {getAmenityIcon(amenity)}
                <span
                  data-pol-id={`lcy3ul_${index}`}
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  {amenity}
                </span>
              </div>
            ))}
            {unavailableAmenities.slice(0, 2).map((amenity, index) => (
              <div
                key={amenity}
                className="flex items-center gap-3 text-muted-foreground line-through"
                data-pol-id={`ea4kjy_${index}`}
                data-pol-file-name="property-amenities-list"
                data-pol-file-type="component"
              >
                <XIcon
                  className="h-5 w-5"
                  data-pol-id={`o6rnas_${index}`}
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                />
                <span
                  data-pol-id={`6c11w8_${index}`}
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  {amenity}
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAllAmenities(true)}
            data-pol-id="3uk3nl"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          >
            Show all{" "}
            {Object.values(amenities).flat().length +
              unavailableAmenities.length}{" "}
            amenities
          </Button>
        </div>
      </div>

      <Dialog
        open={showAllAmenities}
        onOpenChange={setShowAllAmenities}
        data-pol-id="v0rx7f"
        data-pol-file-name="property-amenities-list"
        data-pol-file-type="component"
      >
        <DialogContent
          className="max-w-3xl"
          data-pol-id="ej3srh"
          data-pol-file-name="property-amenities-list"
          data-pol-file-type="component"
        >
          <DialogHeader
            data-pol-id="r2ogm2"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          >
            <DialogTitle
              className="text-xl font-semibold"
              data-pol-id="b1burq"
              data-pol-file-name="property-amenities-list"
              data-pol-file-type="component"
            >
              All amenities
            </DialogTitle>
          </DialogHeader>
          <div
            className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
            data-pol-id="ht88ou"
            data-pol-file-name="property-amenities-list"
            data-pol-file-type="component"
          >
            {Object.entries(amenities).map(([category, items], index) => (
              <div
                key={category}
                className="space-y-3"
                data-pol-id={`byfn9a_${index}`}
                data-pol-file-name="property-amenities-list"
                data-pol-file-type="component"
              >
                <h3
                  className="text-lg font-medium flex items-center gap-2"
                  data-pol-id={`73w7v9_${index}`}
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  {CATEGORY_ICONS[category]}
                  {CATEGORY_TITLES[category]}
                </h3>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-y-2"
                  data-pol-id={`zwe3g0_${index}`}
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  {items.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                      data-pol-id={`vrf9eq_${index}`}
                      data-pol-file-name="property-amenities-list"
                      data-pol-file-type="component"
                    >
                      <CheckIcon
                        className="h-4 w-4 text-green-600"
                        data-pol-id={`hli9w6_${index}`}
                        data-pol-file-name="property-amenities-list"
                        data-pol-file-type="component"
                      />

                      <span
                        data-pol-id={`vaewd2_${index}`}
                        data-pol-file-name="property-amenities-list"
                        data-pol-file-type="component"
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {unavailableAmenities.length > 0 && (
              <div
                className="space-y-3"
                data-pol-id="qnw0bj"
                data-pol-file-name="property-amenities-list"
                data-pol-file-type="component"
              >
                <h3
                  className="text-lg font-medium flex items-center gap-2"
                  data-pol-id="47672k"
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  <AlertOctagonIcon
                    className="h-5 w-5"
                    data-pol-id="15guqv"
                    data-pol-file-name="property-amenities-list"
                    data-pol-file-type="component"
                  />
                  Not included
                </h3>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-y-2"
                  data-pol-id="vjzcad"
                  data-pol-file-name="property-amenities-list"
                  data-pol-file-type="component"
                >
                  {unavailableAmenities.map((item, index) => (
                    <div
                      key={item}
                      className="flex flex-col"
                      data-pol-id={`c5jdid_${index}`}
                      data-pol-file-name="property-amenities-list"
                      data-pol-file-type="component"
                    >
                      <div
                        className="flex items-center gap-2 text-muted-foreground"
                        data-pol-id={`8udkor_${index}`}
                        data-pol-file-name="property-amenities-list"
                        data-pol-file-type="component"
                      >
                        <XIcon
                          className="h-4 w-4 text-red-500"
                          data-pol-id={`wdderp_${index}`}
                          data-pol-file-name="property-amenities-list"
                          data-pol-file-type="component"
                        />

                        <span
                          data-pol-id={`k6g04s_${index}`}
                          data-pol-file-name="property-amenities-list"
                          data-pol-file-type="component"
                        >
                          {item}
                        </span>
                      </div>
                      {unavailableNotes[item] && (
                        <p
                          className="text-sm text-muted-foreground ml-6"
                          data-pol-id={`jenotq_${index}`}
                          data-pol-file-name="property-amenities-list"
                          data-pol-file-type="component"
                        >
                          {unavailableNotes[item]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
