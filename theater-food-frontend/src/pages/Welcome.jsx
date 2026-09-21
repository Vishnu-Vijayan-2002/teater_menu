import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Armchair, ArrowRight, Sparkles } from "lucide-react";
import { saveCustomerSession, getCustomerSession } from "../utils/session";
import { validateSeatNumber } from "../utils/validation";
import { useTheaterConfig } from "../utils/theaterConfig";

const screens = [
  { id: "Screen 1", name: "Screen 1 (Dolby Atmos)" },
  { id: "Screen 2", name: "Screen 2 (Laser 4K)" },
  { id: "Screen 3", name: "IMAX Experience" },
  { id: "VIP Lounge", name: "VIP Gold Class" },
];

const sampleRows = ["A", "B", "C", "D", "E", "F"];

export default function Welcome() {
  const navigate = useNavigate();
  const existingSession = getCustomerSession() || {};
  const theater = useTheaterConfig();

  const [screen, setScreen] = useState(existingSession.screen || "Screen 1");
  const [selectedRow, setSelectedRow] = useState(existingSession.seat ? existingSession.seat[0] : "C");
  const [seatNumber, setSeatNumber] = useState(
    existingSession.seat ? existingSession.seat.slice(1) : "12"
  );
  const [customerName, setCustomerName] = useState(existingSession.customerName || "");
  const [error, setError] = useState("");

  const fullSeat = `${selectedRow}${seatNumber}`.toUpperCase();

  const handleStartOrdering = (e) => {
    e.preventDefault();
    setError("");

    if (!seatNumber) {
      setError("Please enter or select your seat number.");
      return;
    }

    if (!validateSeatNumber(fullSeat)) {
      setError("Please enter a valid seat number (e.g., C12).");
      return;
    }

    saveCustomerSession({
      screen,
      seat: fullSeat,
      customerName: customerName.trim() || "Cinema Guest",
    });

    navigate("/menu");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-glow" />

      <div className="welcome-container">
        {/* Header Branding */}
        <div className="welcome-brand">
          <div className="welcome-brand-icon">
            {theater.logo ? <img src={theater.logo} alt={`${theater.name} logo`} /> : <Film size={28} />}
          </div>
          <span className="brand-title">{theater.name}</span>
          <span className="brand-badge">In-Seat Gourmet Dining</span>
        </div>

        {/* Hero Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-card-header">
            <div className="welcome-tag">
              <Sparkles size={14} />
              <span>DIRECT-TO-SEAT DELIVERY</span>
            </div>
            <h1>Order Without Leaving Your Seat</h1>
            <p>
              Skip the intermission rush. Select your seat below and our theater attendants will deliver
              fresh gourmet popcorn, hot snacks, and chilled drinks directly to you.
            </p>
          </div>

          <form className="welcome-form" onSubmit={handleStartOrdering}>
            {error && <div className="welcome-error-banner">{error}</div>}

            {/* Screen Selection */}
            <div className="form-group">
              <label htmlFor="screen-select">Auditorium / Screen</label>
              <select
                id="screen-select"
                className="welcome-select"
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              >
                {screens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seat Selector */}
            <div className="form-group">
              <label>Select Your Seat</label>
              <div className="seat-row-pills">
                {sampleRows.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`seat-row-pill ${selectedRow === r ? "active" : ""}`}
                    onClick={() => setSelectedRow(r)}
                  >
                    Row {r}
                  </button>
                ))}
              </div>

              <div className="seat-input-wrapper">
                <div className="seat-input-addon">
                  <Armchair size={18} />
                  <span>Row {selectedRow}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="40"
                  placeholder="Seat Number (e.g. 12)"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  className="welcome-seat-input"
                />
              </div>
              <span className="seat-preview-badge">Selected Seat: {fullSeat}</span>
            </div>

            {/* Optional Customer Name */}
            <div className="form-group">
              <label htmlFor="guest-name">Your Name (Optional)</label>
              <input
                id="guest-name"
                type="text"
                placeholder="E.g. Arjun"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="welcome-text-input"
              />
            </div>

            <button type="submit" className="primary-btn welcome-submit-btn">
              <span>Explore Gourmet Menu</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="welcome-footer-note">
            <span>Cinema Lounge • Live Kitchen • Zero Concession Queue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
