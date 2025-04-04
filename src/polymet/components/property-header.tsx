import { Badge } from "@/components/ui/badge";

interface PropertyHeaderProps {
  title: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  details: {
    type: string;
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
}

export default function PropertyHeader({
  title,
  location,
  details,
}: PropertyHeaderProps) {
  return (
    <div
      className="space-y-2"
      data-pol-id="n1ofec"
      data-pol-file-name="property-header"
      data-pol-file-type="component"
    >
      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        data-pol-id="tu3q2i"
        data-pol-file-name="property-header"
        data-pol-file-type="component"
      >
        {title}
      </h1>

      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        data-pol-id="fyk2nh"
        data-pol-file-name="property-header"
        data-pol-file-type="component"
      >
        <div
          data-pol-id="ddzcx7"
          data-pol-file-name="property-header"
          data-pol-file-type="component"
        >
          <p
            className="text-base text-muted-foreground"
            data-pol-id="gfz8kz"
            data-pol-file-name="property-header"
            data-pol-file-type="component"
          >
            {details.type} in {location.city}, {location.state},{" "}
            {location.country}
          </p>
          <p
            className="text-sm text-muted-foreground"
            data-pol-id="tu17y1"
            data-pol-file-name="property-header"
            data-pol-file-type="component"
          >
            {details.guests} guests · {details.bedrooms} bedrooms ·{" "}
            {details.beds} beds · {details.bathrooms} bathrooms
          </p>
        </div>

        <Badge
          variant="outline"
          className="w-fit"
          data-pol-id="xuvax2"
          data-pol-file-name="property-header"
          data-pol-file-type="component"
        >
          Prices include all fees
        </Badge>
      </div>
    </div>
  );
}
