"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GridIcon } from "lucide-react";

interface PropertyImage {
  id: number;
  url: string;
  alt: string;
}

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyImageGallery({
  images,
  title,
}: PropertyImageGalleryProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        className="relative w-full h-[300px] bg-muted rounded-lg"
        data-pol-id="ijbvws"
        data-pol-file-name="property-image-gallery"
        data-pol-file-type="component"
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          data-pol-id="wnngm1"
          data-pol-file-name="property-image-gallery"
          data-pol-file-type="component"
        >
          <p
            className="text-muted-foreground"
            data-pol-id="sv991h"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full"
        data-pol-id="b0ryv3"
        data-pol-file-name="property-image-gallery"
        data-pol-file-type="component"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 rounded-lg overflow-hidden h-[300px] md:h-[450px]"
          data-pol-id="9v9219"
          data-pol-file-name="property-image-gallery"
          data-pol-file-type="component"
        >
          {/* Main large image */}
          <div
            className="md:col-span-2 md:row-span-2 relative h-full"
            data-pol-id="2f4krx"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            <img
              src={images[0].url}
              alt={images[0].alt}
              className="object-cover rounded-lg md:rounded-l-lg md:rounded-r-none w-full h-full"
              data-pol-id="a4ddfb"
              data-pol-file-name="property-image-gallery"
              data-pol-file-type="component"
            />
          </div>

          {/* Secondary images - only show on medium screens and up */}
          <div
            className="hidden md:block relative h-full"
            data-pol-id="v1ct6f"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            {images[1] && (
              <img
                src={images[1].url}
                alt={images[1].alt}
                className="object-cover w-full h-full"
                data-pol-id="74bae6"
                data-pol-file-name="property-image-gallery"
                data-pol-file-type="component"
              />
            )}
          </div>
          <div
            className="hidden md:block relative h-full"
            data-pol-id="cmrn39"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            {images[2] && (
              <img
                src={images[2].url}
                alt={images[2].alt}
                className="object-cover rounded-tr-lg w-full h-full"
                data-pol-id="5d7l2y"
                data-pol-file-name="property-image-gallery"
                data-pol-file-type="component"
              />
            )}
          </div>
          <div
            className="hidden md:block relative h-full"
            data-pol-id="qtkacc"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            {images[3] && (
              <img
                src={images[3].url}
                alt={images[3].alt}
                className="object-cover w-full h-full"
                data-pol-id="r6o2f1"
                data-pol-file-name="property-image-gallery"
                data-pol-file-type="component"
              />
            )}
          </div>
          <div
            className="hidden md:block relative h-full"
            data-pol-id="utff0e"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            {images[4] && (
              <img
                src={images[4].url}
                alt={images[4].alt}
                className="object-cover rounded-br-lg w-full h-full"
                data-pol-id="tp37ob"
                data-pol-file-name="property-image-gallery"
                data-pol-file-type="component"
              />
            )}
          </div>
        </div>

        {/* Show all photos button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white/100 text-black shadow-md"
          onClick={() => setShowAllPhotos(true)}
          data-pol-id="z7jllf"
          data-pol-file-name="property-image-gallery"
          data-pol-file-type="component"
        >
          <GridIcon
            className="h-4 w-4 mr-2"
            data-pol-id="9f0mu3"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          />
          Show all photos
        </Button>
      </div>

      {/* Full photo gallery dialog */}
      <Dialog
        open={showAllPhotos}
        onOpenChange={setShowAllPhotos}
        data-pol-id="a506g4"
        data-pol-file-name="property-image-gallery"
        data-pol-file-type="component"
      >
        <DialogContent
          className="max-w-6xl w-full p-0 bg-background"
          data-pol-id="mxpzp7"
          data-pol-file-name="property-image-gallery"
          data-pol-file-type="component"
        >
          <div
            className="p-6 max-h-[80vh] overflow-y-auto"
            data-pol-id="w1q3ft"
            data-pol-file-name="property-image-gallery"
            data-pol-file-type="component"
          >
            <h2
              className="text-2xl font-bold mb-6 sticky top-0 bg-background pt-2 pb-4 z-10"
              data-pol-id="c7kykf"
              data-pol-file-name="property-image-gallery"
              data-pol-file-type="component"
            >
              {title}
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-pol-id="lmklan"
              data-pol-file-name="property-image-gallery"
              data-pol-file-type="component"
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3]"
                  data-pol-id={`etu9nr_${index}`}
                  data-pol-file-name="property-image-gallery"
                  data-pol-file-type="component"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="object-cover rounded-md w-full h-full"
                    data-pol-id={`a4byp4_${index}`}
                    data-pol-file-name="property-image-gallery"
                    data-pol-file-type="component"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
