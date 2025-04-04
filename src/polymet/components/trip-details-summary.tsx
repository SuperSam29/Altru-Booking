import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TripDetailsSummaryProps {
  tripDetails: {
    checkIn: Date;
    checkOut: Date;
    guests: number;
  };
  onEdit: (type: "dates" | "guests") => void;
}

export default function TripDetailsSummary({
  tripDetails,
  onEdit,
}: TripDetailsSummaryProps) {
  const { checkIn, checkOut, guests } = tripDetails;

  const formatDate = (date: Date) => {
    return format(date, "d MMM");
  };

  const nightsCount = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div
      className="space-y-4"
      data-pol-id="mxqte0"
      data-pol-file-name="trip-details-summary"
      data-pol-file-type="component"
    >
      <h2
        className="text-xl font-semibold"
        data-pol-id="zc0yse"
        data-pol-file-name="trip-details-summary"
        data-pol-file-type="component"
      >
        Your trip
      </h2>

      <div
        className="flex justify-between items-center"
        data-pol-id="ky6hyt"
        data-pol-file-name="trip-details-summary"
        data-pol-file-type="component"
      >
        <div
          data-pol-id="56s9hk"
          data-pol-file-name="trip-details-summary"
          data-pol-file-type="component"
        >
          <h3
            className="font-medium"
            data-pol-id="071v1o"
            data-pol-file-name="trip-details-summary"
            data-pol-file-type="component"
          >
            Dates
          </h3>
          <p
            className="text-muted-foreground"
            data-pol-id="6ujtlu"
            data-pol-file-name="trip-details-summary"
            data-pol-file-type="component"
          >
            {formatDate(checkIn)}–{formatDate(checkOut)}
          </p>
        </div>
        <Button
          variant="ghost"
          className="underline font-normal h-auto p-0"
          onClick={() => onEdit("dates")}
          data-pol-id="h3wycv"
          data-pol-file-name="trip-details-summary"
          data-pol-file-type="component"
        >
          Edit
        </Button>
      </div>

      <div
        className="flex justify-between items-center"
        data-pol-id="pxprts"
        data-pol-file-name="trip-details-summary"
        data-pol-file-type="component"
      >
        <div
          data-pol-id="n95ed4"
          data-pol-file-name="trip-details-summary"
          data-pol-file-type="component"
        >
          <h3
            className="font-medium"
            data-pol-id="qkzssh"
            data-pol-file-name="trip-details-summary"
            data-pol-file-type="component"
          >
            Guests
          </h3>
          <p
            className="text-muted-foreground"
            data-pol-id="mqs3do"
            data-pol-file-name="trip-details-summary"
            data-pol-file-type="component"
          >
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
        <Button
          variant="ghost"
          className="underline font-normal h-auto p-0"
          onClick={() => onEdit("guests")}
          data-pol-id="2skct7"
          data-pol-file-name="trip-details-summary"
          data-pol-file-type="component"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
