import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyPage from "@/polymet/pages/property-page";
import PropertyPageUpdated from "@/polymet/pages/property-page-updated";
import PropertyPageEnhanced from "@/polymet/pages/property-page-enhanced";
import PropertyBookingConfirmation from "@/polymet/pages/property-booking-confirmation";

export default function PropertyPrototypeEnhanced() {
  return (
    <Router
      data-pol-id="mkj1qx"
      data-pol-file-name="property-prototype-enhanced"
      data-pol-file-type="prototype"
    >
      <Routes
        data-pol-id="r8yaxb"
        data-pol-file-name="property-prototype-enhanced"
        data-pol-file-type="prototype"
      >
        <Route
          path="/"
          element={
            <PropertyPageEnhanced
              data-pol-id="tmfd5a"
              data-pol-file-name="property-prototype-enhanced"
              data-pol-file-type="prototype"
            />
          }
          data-pol-id="jdeflb"
          data-pol-file-name="property-prototype-enhanced"
          data-pol-file-type="prototype"
        />
        <Route
          path="/property/:propertyId"
          element={
            <PropertyPageEnhanced
              data-pol-id="2aku7r"
              data-pol-file-name="property-prototype-enhanced"
              data-pol-file-type="prototype"
            />
          }
          data-pol-id="albueu"
          data-pol-file-name="property-prototype-enhanced"
          data-pol-file-type="prototype"
        />

        <Route
          path="/property-original/:propertyId"
          element={
            <PropertyPage
              data-pol-id="vo3y8a"
              data-pol-file-name="property-prototype-enhanced"
              data-pol-file-type="prototype"
            />
          }
          data-pol-id="k29yje"
          data-pol-file-name="property-prototype-enhanced"
          data-pol-file-type="prototype"
        />

        <Route
          path="/property-updated/:propertyId"
          element={
            <PropertyPageUpdated
              data-pol-id="ktkxaz"
              data-pol-file-name="property-prototype-enhanced"
              data-pol-file-type="prototype"
            />
          }
          data-pol-id="fpq6c8"
          data-pol-file-name="property-prototype-enhanced"
          data-pol-file-type="prototype"
        />

        <Route
          path="/property/:propertyId/booking"
          element={
            <PropertyBookingConfirmation
              data-pol-id="wmcrzx"
              data-pol-file-name="property-prototype-enhanced"
              data-pol-file-type="prototype"
            />
          }
          data-pol-id="hwsbt2"
          data-pol-file-name="property-prototype-enhanced"
          data-pol-file-type="prototype"
        />
      </Routes>
    </Router>
  );
}
