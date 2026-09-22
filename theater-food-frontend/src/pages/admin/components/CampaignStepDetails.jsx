import {
  Users,
  MessageSquare,
  Megaphone,
} from "lucide-react";

const AUDIENCES = [
  {
    id: "all_customers",
    name: "All Customers",
    description:
      "Send to all customers who have opted in.",
    count: 0,
  },

  {
    id: "frequent_guests",
    name: "Frequent Guests",
    description:
      "Customers who regularly order from your theater.",
    count: 248,
  },

  {
    id: "recent_buyers",
    name: "Recent Buyers",
    description:
      "Customers who recently placed an order.",
    count: 126,
  },

  {
    id: "combo_buyers",
    name: "Combo Customers",
    description:
      "Customers who purchased food combos.",
    count: 84,
  },
];

export default function CampaignStepDetails({
  campaign,
  update,
}) {
  const selectedAudience =
    AUDIENCES.find(
      (item) =>
        item.id ===
        campaign.audience.segmentId
    );

  function selectAudience(
    audience
  ) {
    update(
      "audience",
      {
        type: "SEGMENT",

        segmentId:
          audience.id,

        recipientCount:
          audience.count,
      }
    );
  }

  return (
    <section className="campaign-builder-card">

      <div className="campaign-section-heading">

        <div>
          <span className="campaign-step-kicker">
            STEP 1
          </span>

          <h3>
            Campaign Details & Audience
          </h3>

          <p>
            Define who should receive
            this WhatsApp campaign.
          </p>
        </div>

        <div className="campaign-heading-icon">
          <Megaphone size={20} />
        </div>

      </div>

      <div className="campaign-form-group">

        <label>
          Campaign Name

          <input
            type="text"
            value={campaign.name}
            onChange={(e) =>
              update(
                "name",
                e.target.value
              )
            }
            placeholder="Weekend Movie Combo Promotion"
          />
        </label>

      </div>

      <div className="campaign-form-group">

        <label>
          WhatsApp Template Name

          <input
            type="text"
            value={
              campaign.whatsapp
                .templateName
            }
            onChange={(e) =>
              update(
                "whatsapp.templateName",
                e.target.value
              )
            }
            placeholder="weekend_combo_offer"
          />

          <small>
            This must match an approved
            WhatsApp template in Meta.
          </small>
        </label>

      </div>

      <div className="campaign-form-group">

        <label>
          Template Language
        </label>

        <select
          value={
            campaign.whatsapp
              .templateLanguage
          }
          onChange={(e) =>
            update(
              "whatsapp.templateLanguage",
              e.target.value
            )
          }
        >
          <option value="en">
            English
          </option>

          <option value="en_US">
            English (US)
          </option>

          <option value="ml">
            Malayalam
          </option>

          <option value="hi">
            Hindi
          </option>
        </select>

      </div>

      <div className="campaign-audience-heading">

        <div>
          <h4>
            Target Audience
          </h4>

          <p>
            Select the customer group
            for this campaign.
          </p>
        </div>

        <Users size={18} />

      </div>

      <div className="campaign-audience-grid">

        {AUDIENCES.map(
          (audience) => {
            const active =
              campaign.audience
                .segmentId ===
              audience.id;

            return (
              <button
                key={audience.id}
                type="button"
                className={
                  active
                    ? "campaign-audience-card active"
                    : "campaign-audience-card"
                }
                onClick={() =>
                  selectAudience(
                    audience
                  )
                }
              >
                <div className="campaign-audience-icon">
                  <Users size={17} />
                </div>

                <div>
                  <strong>
                    {audience.name}
                  </strong>

                  <p>
                    {audience.description}
                  </p>

                  <span>
                    {audience.count ||
                      "—"}{" "}
                    recipients
                  </span>
                </div>

              </button>
            );
          }
        )}

      </div>

      {selectedAudience && (
        <div className="campaign-audience-summary">

          <MessageSquare size={17} />

          <div>
            <strong>
              {selectedAudience.name}
            </strong>

            <span>
              {selectedAudience.count}{" "}
              recipients selected
            </span>
          </div>

        </div>
      )}

    </section>
  );
}