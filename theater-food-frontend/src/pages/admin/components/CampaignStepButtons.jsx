import {
  Plus,
  Trash2,
  Globe,
  Phone,
  MessageCircle,
} from "lucide-react";

import { BUTTON_TYPES } from "../../../utils/whatsappCampaign";

export default function CampaignStepButtons({
  campaign,
  update,
}) {
  const buttons =
    campaign.whatsapp.buttons ||
    [];

  function addButton() {
    if (buttons.length >= 3) {
      return;
    }

    update(
      "whatsapp.buttons",
      [
        ...buttons,

        {
          type:
            BUTTON_TYPES.QUICK_REPLY,

          text: "Reply",
        },
      ]
    );
  }

  function removeButton(
    index
  ) {
    update(
      "whatsapp.buttons",
      buttons.filter(
        (_, i) =>
          i !== index
      )
    );
  }

  function updateButton(
    index,
    key,
    value
  ) {
    update(
      "whatsapp.buttons",
      buttons.map(
        (button, i) =>
          i === index
            ? {
                ...button,
                [key]: value,
              }
            : button
      )
    );
  }

  return (
    <section className="campaign-builder-card">

      <div className="campaign-section-heading">

        <div>
          <span className="campaign-step-kicker">
            STEP 3
          </span>

          <h3>
            Interactive CTA Buttons
          </h3>

          <p>
            Add actions customers can
            use directly from WhatsApp.
          </p>
        </div>

        <button
          type="button"
          className="secondary-admin-button"
          disabled={
            buttons.length >= 3
          }
          onClick={
            addButton
          }
        >
          <Plus size={16} />

          Add Button
        </button>

      </div>

      <div className="campaign-button-limit">

        <span>
          Interactive buttons
        </span>

        <strong>
          {buttons.length} / 3
        </strong>

      </div>

      {buttons.map(
        (button, index) => (
          <div
            className="campaign-button-card"
            key={index}
          >

            <div className="campaign-button-card-header">

              <div className="campaign-button-number">
                {index + 1}
              </div>

              <div>
                <strong>
                  Button {index + 1}
                </strong>

                <span>
                  Configure action
                </span>
              </div>

              <button
                type="button"
                className="campaign-delete-button"
                onClick={() =>
                  removeButton(
                    index
                  )
                }
              >
                <Trash2
                  size={16}
                />
              </button>

            </div>

            <div className="campaign-grid">

              <label>
                Button Type

                <select
                  value={
                    button.type
                  }
                  onChange={(
                    e
                  ) =>
                    updateButton(
                      index,
                      "type",
                      e.target.value
                    )
                  }
                >
                  <option
                    value={
                      BUTTON_TYPES.URL
                    }
                  >
                    Website / URL
                  </option>

                  <option
                    value={
                      BUTTON_TYPES.PHONE
                    }
                  >
                    Call
                  </option>

                  <option
                    value={
                      BUTTON_TYPES.QUICK_REPLY
                    }
                  >
                    Quick Reply
                  </option>
                </select>
              </label>

              <label>
                Button Text

                <input
                  value={
                    button.text ||
                    ""
                  }
                  onChange={(
                    e
                  ) =>
                    updateButton(
                      index,
                      "text",
                      e.target.value
                    )
                  }
                  maxLength={25}
                  placeholder={
                    button.type ===
                    BUTTON_TYPES.URL
                      ? "Book Now"
                      : button.type ===
                        BUTTON_TYPES.PHONE
                      ? "Call Us"
                      : "Yes, Book"
                  }
                />
              </label>

              {button.type ===
                BUTTON_TYPES.URL && (
                <label className="campaign-full-field">
                  Website URL

                  <div className="campaign-input-with-icon">

                    <Globe
                      size={16}
                    />

                    <input
                      value={
                        button.url ||
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        updateButton(
                          index,
                          "url",
                          e.target
                            .value
                        )
                      }
                      placeholder="https://example.com/book"
                    />

                  </div>

                </label>
              )}

              {button.type ===
                BUTTON_TYPES.PHONE && (
                <label className="campaign-full-field">
                  Phone Number

                  <div className="campaign-input-with-icon">

                    <Phone
                      size={16}
                    />

                    <input
                      value={
                        button.phoneNumber ||
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        updateButton(
                          index,
                          "phoneNumber",
                          e.target
                            .value
                        )
                      }
                      placeholder="+919496755714"
                    />

                  </div>

                  <small>
                    Use international
                    format.
                  </small>

                </label>
              )}

              {button.type ===
                BUTTON_TYPES.QUICK_REPLY && (
                <div className="campaign-quick-reply-info campaign-full-field">

                  <MessageCircle
                    size={18}
                  />

                  <div>
                    <strong>
                      Quick Reply
                    </strong>

                    <p>
                      When the customer
                      taps this button,
                      WhatsApp sends the
                      configured reply
                      payload.
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>
        )
      )}

      {buttons.length ===
        0 && (
        <div className="campaign-empty-state">

          <MessageCircle
            size={26}
          />

          <strong>
            No buttons added
          </strong>

          <p>
            Add a CTA such as
            Book Now, Call Us,
            or a Quick Reply.
          </p>

          <button
            type="button"
            className="secondary-admin-button"
            onClick={
              addButton
            }
          >
            <Plus size={15} />
            Add First Button
          </button>

        </div>
      )}

    </section>
  );
}