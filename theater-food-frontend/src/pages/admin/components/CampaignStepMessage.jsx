import {
  Image,
  Video,
  FileText,
  Type,
  Upload,
  X,
} from "lucide-react";

import {
  HEADER_TYPES,
  DEFAULT_VARIABLES,
} from "../../../utils/whatsappCampaign";

export default function CampaignStepMessage({
  campaign,
  update,
  onUploadMedia,
  uploading,
}) {
  const header =
    campaign.whatsapp.header;

  function handleHeaderType(
    type
  ) {
    update(
      "whatsapp.header",
      {
        type,

        text: "",

        mediaUrl: "",

        mediaType: "",

        fileName: "",
      }
    );
  }

  function insertVariable(
    token
  ) {
    update(
      "whatsapp.body.text",
      `${campaign.whatsapp.body.text}${campaign.whatsapp.body.text ? " " : ""}${token}`
    );
  }

  function clearMedia() {
    update(
      "whatsapp.header",
      {
        ...header,

        mediaUrl: "",

        mediaType: "",

        fileName: "",
      }
    );
  }

  return (
    <section className="campaign-builder-card">

      <div className="campaign-section-heading">

        <div>
          <span className="campaign-step-kicker">
            STEP 2
          </span>

          <h3>
            Message & Media Builder
          </h3>

          <p>
            Build the WhatsApp message
            that your customers will receive.
          </p>
        </div>

      </div>

      <div className="campaign-form-group">

        <label>
          Header Type
        </label>

        <div className="campaign-header-options">

          <HeaderOption
            active={
              header.type ===
              HEADER_TYPES.NONE
            }
            icon={<X size={17} />}
            title="None"
            onClick={() =>
              handleHeaderType(
                HEADER_TYPES.NONE
              )
            }
          />

          <HeaderOption
            active={
              header.type ===
              HEADER_TYPES.TEXT
            }
            icon={<Type size={17} />}
            title="Text"
            onClick={() =>
              handleHeaderType(
                HEADER_TYPES.TEXT
              )
            }
          />

          <HeaderOption
            active={
              header.type ===
              HEADER_TYPES.IMAGE
            }
            icon={<Image size={17} />}
            title="Image"
            onClick={() =>
              handleHeaderType(
                HEADER_TYPES.IMAGE
              )
            }
          />

          <HeaderOption
            active={
              header.type ===
              HEADER_TYPES.VIDEO
            }
            icon={<Video size={17} />}
            title="Video"
            onClick={() =>
              handleHeaderType(
                HEADER_TYPES.VIDEO
              )
            }
          />

          <HeaderOption
            active={
              header.type ===
              HEADER_TYPES.DOCUMENT
            }
            icon={<FileText size={17} />}
            title="PDF"
            onClick={() =>
              handleHeaderType(
                HEADER_TYPES.DOCUMENT
              )
            }
          />

        </div>

      </div>

      {header.type ===
        HEADER_TYPES.TEXT && (
        <div className="campaign-form-group">

          <label>
            Header Text

            <input
              value={
                header.text
              }
              onChange={(e) =>
                update(
                  "whatsapp.header.text",
                  e.target.value
                )
              }
              maxLength={60}
              placeholder="🎬 Weekend Special"
            />
          </label>

        </div>
      )}

      {[
        HEADER_TYPES.IMAGE,
        HEADER_TYPES.VIDEO,
        HEADER_TYPES.DOCUMENT,
      ].includes(
        header.type
      ) && (
        <div className="campaign-form-group">

          <label>
            Campaign Media
          </label>

          {header.mediaUrl ? (
            <div className="campaign-uploaded-media">

              {header.type ===
                HEADER_TYPES.IMAGE && (
                <img
                  src={
                    header.mediaUrl
                  }
                  alt="Campaign"
                />
              )}

              {header.type ===
                HEADER_TYPES.VIDEO && (
                <video
                  src={
                    header.mediaUrl
                  }
                  controls
                />
              )}

              {header.type ===
                HEADER_TYPES.DOCUMENT && (
                <div className="campaign-pdf-preview">
                  <FileText
                    size={28}
                  />

                  <span>
                    {header.fileName ||
                      "PDF Document"}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="campaign-remove-media"
                onClick={
                  clearMedia
                }
              >
                <X size={15} />
              </button>

            </div>
          ) : (
            <label className="campaign-upload-box">

              <Upload size={22} />

              <strong>
                {uploading
                  ? "Uploading..."
                  : "Upload campaign media"}
              </strong>

              <small>
                {header.type ===
                HEADER_TYPES.IMAGE
                  ? "JPG, PNG or WEBP"
                  : header.type ===
                    HEADER_TYPES.VIDEO
                  ? "MP4 up to 50MB"
                  : "PDF document"}
              </small>

              <input
                type="file"
                hidden
                accept={
                  header.type ===
                  HEADER_TYPES.IMAGE
                    ? "image/*"
                    : header.type ===
                      HEADER_TYPES.VIDEO
                    ? "video/mp4"
                    : "application/pdf"
                }
                disabled={
                  uploading
                }
                onChange={async (
                  e
                ) => {
                  const file =
                    e.target.files?.[0];

                  if (
                    file &&
                    onUploadMedia
                  ) {
                    await onUploadMedia(
                      file
                    );
                  }

                  e.target.value =
                    "";
                }}
              />

            </label>
          )}

        </div>
      )}

      <div className="campaign-form-group">

        <label>
          Message Body

          <textarea
            rows={8}
            value={
              campaign.whatsapp.body
                .text
            }
            onChange={(e) =>
              update(
                "whatsapp.body.text",
                e.target.value
              )
            }
            placeholder="Hi {{1}}, enjoy our latest movie offer..."
          />

          <small>
         <span>
  Use dynamic variables such as {"{{1}}"} and {"{{2}}"}.
</span>
          </small>
        </label>

      </div>

      <div className="campaign-variable-section">

        <div className="campaign-variable-heading">
          <strong>
            Dynamic Variables
          </strong>

          <span>
            Click to insert
          </span>
        </div>

        <div className="campaign-variable-list">

          {DEFAULT_VARIABLES.map(
            (variable) => (
              <button
                key={
                  variable.token
                }
                type="button"
                onClick={() =>
                  insertVariable(
                    variable.token
                  )
                }
              >
                <strong>
                  {variable.token}
                </strong>

                <span>
                  {variable.label}
                </span>
              </button>
            )
          )}

        </div>

      </div>

      <div className="campaign-form-group">

        <label>
          Footer Text
          <span className="optional-label">
            Optional
          </span>

          <input
            value={
              campaign.whatsapp
                .footer.text
            }
            onChange={(e) =>
              update(
                "whatsapp.footer.text",
                e.target.value
              )
            }
            maxLength={60}
            placeholder="Reply STOP to unsubscribe"
          />

        </label>

      </div>

    </section>
  );
}

function HeaderOption({
  active,
  icon,
  title,
  onClick,
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "campaign-header-option active"
          : "campaign-header-option"
      }
      onClick={onClick}
    >
      <span>
        {icon}
      </span>

      <strong>
        {title}
      </strong>
    </button>
  );
}