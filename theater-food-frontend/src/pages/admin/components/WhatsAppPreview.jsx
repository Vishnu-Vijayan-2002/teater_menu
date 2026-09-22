import {
  CheckCheck,
  Phone,
  ExternalLink,
  MessageCircle,
  FileText,
} from "lucide-react";

import { renderPreviewText } from "../../../utils/whatsappCampaign";

export default function WhatsAppPreview({
  campaign,
}) {
  const {
    header,
    body,
    footer,
    buttons,
  } = campaign.whatsapp;

  const previewText =
    renderPreviewText(
      body.text,
      {
        customer_name:
          "Rahul",

        movie_title:
          "Weekend Special",

        booking_url:
          "https://cinema.example.com",

        discount:
          "15%",
      }
    );

  return (
    <aside className="campaign-preview-panel">

      <div className="campaign-preview-heading">

        <div>
          <span>
            LIVE PREVIEW
          </span>

          <h3>
            WhatsApp
          </h3>
        </div>

        <div className="whatsapp-preview-status">
          <span />
          Live
        </div>

      </div>

      <div className="whatsapp-device">

        <div className="whatsapp-phone-header">

          <div className="whatsapp-phone-back">
            ‹
          </div>

          <div className="whatsapp-avatar">
            C
          </div>

          <div className="whatsapp-contact">

            <strong>
              Cinema
            </strong>

            <small>
              Business account
            </small>

          </div>

          <div className="whatsapp-phone-actions">
            <Phone size={16} />
            <span>•••</span>
          </div>

        </div>

        <div className="whatsapp-chat-background">

          <div className="whatsapp-date-chip">
            TODAY
          </div>

          <div className="whatsapp-message-bubble">

            {header.type ===
              "TEXT" &&
              header.text && (
                <div className="whatsapp-preview-header-text">
                  {header.text}
                </div>
              )}

            {header.type ===
              "IMAGE" &&
              header.mediaUrl && (
                <img
                  src={
                    header.mediaUrl
                  }
                  alt="Campaign"
                  className="whatsapp-preview-image"
                />
              )}

            {header.type ===
              "VIDEO" &&
              header.mediaUrl && (
                <video
                  src={
                    header.mediaUrl
                  }
                  controls
                  className="whatsapp-preview-image"
                />
              )}

            {header.type ===
              "DOCUMENT" &&
              header.mediaUrl && (
                <div className="whatsapp-preview-document">

                  <div>
                    <FileText
                      size={26}
                    />
                  </div>

                  <span>
                    {header.fileName ||
                      "Campaign.pdf"}
                  </span>

                </div>
              )}

            {!header.mediaUrl &&
              header.type !==
                "TEXT" &&
              header.type !==
                "NONE" && (
                <div className="whatsapp-media-placeholder">
                  Media preview
                </div>
              )}

            <div className="whatsapp-preview-body">
              {previewText ||
                "Your message will appear here..."}
            </div>

            {footer.text && (
              <div className="whatsapp-preview-footer">
                {footer.text}
              </div>
            )}

            <div className="whatsapp-preview-time">

              <span>
                12:45 PM
              </span>

              <CheckCheck
                size={14}
              />

            </div>

          </div>

          {buttons.length > 0 && (
            <div className="whatsapp-preview-buttons">

              {buttons.map(
                (button, index) => (
                  <button
                    key={index}
                    type="button"
                  >

                    {button.type ===
                      "URL" && (
                      <ExternalLink
                        size={14}
                      />
                    )}

                    {button.type ===
                      "PHONE" && (
                      <Phone
                        size={14}
                      />
                    )}

                    {button.type ===
                      "QUICK_REPLY" && (
                      <MessageCircle
                        size={14}
                      />
                    )}

                    {button.text ||
                      `Button ${
                        index + 1
                      }`}

                  </button>
                )
              )}

            </div>
          )}

        </div>

      </div>

      <div className="campaign-preview-note">
        <strong>
          Preview only
        </strong>

        <span>
          Actual WhatsApp rendering
          depends on the approved Meta
          template configuration.
        </span>
      </div>

    </aside>
  );
}