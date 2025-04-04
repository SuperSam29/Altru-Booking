interface PriceBreakdownProps {
  pricing: {
    basePrice: number;
    currency: string;
    nights: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
}

export default function PropertyPriceBreakdown({
  pricing,
}: PriceBreakdownProps) {
  const { basePrice, currency, nights, serviceFee, taxes, total } = pricing;
  const nightlyTotal = basePrice * nights;

  return (
    <div
      className="space-y-4"
      data-pol-id="ji7iva"
      data-pol-file-name="property-price-breakdown"
      data-pol-file-type="component"
    >
      <h3
        className="text-lg font-medium"
        data-pol-id="siily0"
        data-pol-file-name="property-price-breakdown"
        data-pol-file-type="component"
      >
        Price details
      </h3>
      <div
        className="space-y-2"
        data-pol-id="kck7d9"
        data-pol-file-name="property-price-breakdown"
        data-pol-file-type="component"
      >
        <div
          className="flex justify-between"
          data-pol-id="r6fxxs"
          data-pol-file-name="property-price-breakdown"
          data-pol-file-type="component"
        >
          <span
            data-pol-id="g449sx"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            {currency}
            {basePrice.toLocaleString()} × {nights} nights
          </span>
          <span
            data-pol-id="yf7sgb"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            {currency}
            {nightlyTotal.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between"
          data-pol-id="17g60s"
          data-pol-file-name="property-price-breakdown"
          data-pol-file-type="component"
        >
          <span
            data-pol-id="pw4qkr"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            Service fee
          </span>
          <span
            data-pol-id="ghwuhr"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            {currency}
            {serviceFee.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between"
          data-pol-id="y92qgy"
          data-pol-file-name="property-price-breakdown"
          data-pol-file-type="component"
        >
          <span
            data-pol-id="h63zwo"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            Taxes
          </span>
          <span
            data-pol-id="opj5hf"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            {currency}
            {taxes.toLocaleString()}
          </span>
        </div>
        <div
          className="h-px bg-border my-2"
          data-pol-id="0e6ri9"
          data-pol-file-name="property-price-breakdown"
          data-pol-file-type="component"
        />
        <div
          className="flex justify-between font-medium"
          data-pol-id="1yl23n"
          data-pol-file-name="property-price-breakdown"
          data-pol-file-type="component"
        >
          <span
            data-pol-id="sa2vwt"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            Total ({currency})
          </span>
          <span
            data-pol-id="hbw0i8"
            data-pol-file-name="property-price-breakdown"
            data-pol-file-type="component"
          >
            {currency}
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
