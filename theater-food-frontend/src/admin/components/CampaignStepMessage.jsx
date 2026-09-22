import React from "react";
import { uploadCampaignMedia } from "../../services/campaignService";

export default function CampaignStepMessage({ campaign, update, setError }) {
  const types = ["NONE", "TEXT", "IMAGE", "VIDEO", "DOCUMENT"];

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const media = await uploadCampaignMedia(file);
      update("whatsapp.header.mediaUrl", media.url);
      update("whatsapp.header.mediaType", media.type);
      update("whatsapp.header.fileName", media.fileName);
    } catch (error) {
      setError(error.message || "Media upload failed.");
    }
  }

  return (
    <div className="campaign-builder-step">
      <div className="campaign-section-heading">
        <span>STEP 2</span><h2>Message & media</h2>
      </div>

      <div className="campaign-form-grid">
        <div className="campaign-full-field">
          <span className="campaign-label">Header type</span>
          <div className="campaign-header-types">
            {types.map(type => (
              <button type="button"
                key={type}
                className={campaign.whatsapp.header.type === type ? "selected" : ""}
                onClick={() => update("whatsapp.header.type", type)}>
                {type === "NONE" ? "None" : type === "DOCUMENT" ? "PDF" : type[0] + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {campaign.whatsapp.header.type === "TEXT" && (
          <label className="campaign-full-field">
            Header text
            <input value={campaign.whatsapp.header.text}
              onChange={e => update("whatsapp.header.text", e.target.value)}
              placeholder="Weekend Combo Offer" />
          </label>
        )}

        {["IMAGE", "VIDEO", "DOCUMENT"].includes(campaign.whatsapp.header.type) && (
          <div className="campaign-full-field campaign-upload">
            <label>
              Media URL
              <input value={campaign.whatsapp.header.mediaUrl}
                onChange={e => update("whatsapp.header.mediaUrl", e.target.value)}
                placeholder="https://..." />
            </label>
            <label className="campaign-upload-button">
              Upload media
              <input hidden type="file"
                accept={campaign.whatsapp.header.type === "IMAGE" ? "image/*" :
                  campaign.whatsapp.header.type === "VIDEO" ? "video/*" : ".pdf,application/pdf"}
                onChange={handleUpload} />
            </label>
            {campaign.whatsapp.header.fileName && <small>{campaign.whatsapp.header.fileName}</small>}
          </div>
        )}

        <label className="campaign-full-field">
          Message body
          <textarea rows="7" value={campaign.whatsapp.body}
            onChange={e => update("whatsapp.body", e.target.value)}
            placeholder="Hi {{1}}, enjoy 15% off your next cinema combo." />
          <div className="campaign-variable-row">
            {["{{1}}", "{{2}}", "{{3}}", "{{4}}"].map(variable => (
              <button type="button" key={variable}
                onClick={() => update("whatsapp.body", campaign.whatsapp.body + (campaign.whatsapp.body ? " " : "") + variable)}>
                {variable}
              </button>
            ))}
          </div>
        </label>

        <label>
          Optional footer
          <input value={campaign.whatsapp.footer}
            onChange={e => update("whatsapp.footer", e.target.value)}
            placeholder="Reply STOP to opt out." />
        </label>
      </div>
    </div>
  );
}