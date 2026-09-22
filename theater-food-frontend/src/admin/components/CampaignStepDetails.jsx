import React from "react";

export default function CampaignStepDetails({ campaign, update }) {
  const audiences = [
    ["All customers", "All opted-in customers", 1240],
    ["Frequent guests", "3+ orders in the last 60 days", 248],
    ["Recent customers", "Ordered in the last 30 days", 684],
    ["High-value customers", "₹1,000+ lifetime spend", 96],
    ["Combo buyers", "Customers who purchased combos", 412],
  ];

  return (
    <div className="campaign-builder-step">
      <div className="campaign-section-heading">
        <span>STEP 1</span><h2>Campaign details & audience</h2>
      </div>

      <div className="campaign-form-grid">
        <label>
          Campaign name
          <input value={campaign.name} onChange={e => update("name", e.target.value)}
            placeholder="Friday combo promotion" />
        </label>

        <label>
          Approved WhatsApp template name
          <input value={campaign.whatsapp.templateName}
            onChange={e => update("whatsapp.templateName", e.target.value)}
            placeholder="cinema_marketing_offer" />
        </label>

        <label>
          Template language
          <select value={campaign.whatsapp.templateLanguage}
            onChange={e => update("whatsapp.templateLanguage", e.target.value)}>
            <option value="en_US">English (US)</option>
            <option value="en">English</option>
            <option value="ml">Malayalam</option>
            <option value="hi">Hindi</option>
          </select>
        </label>

        <label>
          Recipient count
          <input readOnly value={campaign.audience.recipientCount.toLocaleString("en-IN")} />
        </label>

        <div className="campaign-full-field">
          <span className="campaign-label">Target audience</span>
          <div className="campaign-audience-grid">
            {audiences.map(([id, description, count]) => (
              <button type="button"
                key={id}
                className={campaign.audience.type === id ? "selected" : ""}
                onClick={() => {
                  update("audience.type", id);
                  update("audience.recipientCount", count);
                }}>
                <strong>{id.replaceAll("_", " ")}</strong>
                <small>{description}</small>
                <b>{count.toLocaleString("en-IN")}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}