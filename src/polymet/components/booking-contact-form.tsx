"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface BookingContactFormProps {
  onSubmit: (data: { countryCode: string; phoneNumber: string }) => void;
}

const COUNTRY_CODES = [
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

export default function BookingContactForm({
  onSubmit,
}: BookingContactFormProps) {
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({ countryCode, phoneNumber });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div
      className="space-y-4"
      data-pol-id="8moyi8"
      data-pol-file-name="booking-contact-form"
      data-pol-file-type="component"
    >
      <div
        data-pol-id="awj1m9"
        data-pol-file-name="booking-contact-form"
        data-pol-file-type="component"
      >
        <h2
          className="text-xl font-semibold mb-2"
          data-pol-id="zz549a"
          data-pol-file-name="booking-contact-form"
          data-pol-file-type="component"
        >
          Log in or sign up to book
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        data-pol-id="0nu6zl"
        data-pol-file-name="booking-contact-form"
        data-pol-file-type="component"
      >
        <div
          className="space-y-2"
          data-pol-id="05tbp0"
          data-pol-file-name="booking-contact-form"
          data-pol-file-type="component"
        >
          <Label
            htmlFor="country-code"
            data-pol-id="tedcez"
            data-pol-file-name="booking-contact-form"
            data-pol-file-type="component"
          >
            Country/Region
          </Label>
          <Select
            value={countryCode}
            onValueChange={setCountryCode}
            data-pol-id="y4kagb"
            data-pol-file-name="booking-contact-form"
            data-pol-file-type="component"
          >
            <SelectTrigger
              className="w-full"
              data-pol-id="tnhydq"
              data-pol-file-name="booking-contact-form"
              data-pol-file-type="component"
            >
              <SelectValue
                placeholder="Select country"
                data-pol-id="rj2ngi"
                data-pol-file-name="booking-contact-form"
                data-pol-file-type="component"
              />
            </SelectTrigger>
            <SelectContent
              data-pol-id="kd7zvf"
              data-pol-file-name="booking-contact-form"
              data-pol-file-type="component"
            >
              {COUNTRY_CODES.map((country, index) => (
                <SelectItem
                  key={country.code}
                  value={country.code}
                  data-pol-id={`0vcwi5_${index}`}
                  data-pol-file-name="booking-contact-form"
                  data-pol-file-type="component"
                >
                  {country.country} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="space-y-2"
          data-pol-id="6uwlu7"
          data-pol-file-name="booking-contact-form"
          data-pol-file-type="component"
        >
          <Label
            htmlFor="phone-number"
            data-pol-id="9lkr88"
            data-pol-file-name="booking-contact-form"
            data-pol-file-type="component"
          >
            Phone number
          </Label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
            data-pol-id="cv9zf7"
            data-pol-file-name="booking-contact-form"
            data-pol-file-type="component"
          />

          <p
            className="text-xs text-muted-foreground"
            data-pol-id="lqluv2"
            data-pol-file-name="booking-contact-form"
            data-pol-file-type="component"
          >
            We'll call or text you to confirm your number. Standard message and
            data rates apply.{" "}
            <Link
              to="/privacy"
              className="underline"
              data-pol-id="3j71p0"
              data-pol-file-name="booking-contact-form"
              data-pol-file-type="component"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          data-pol-id="l2ft8z"
          data-pol-file-name="booking-contact-form"
          data-pol-file-type="component"
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
