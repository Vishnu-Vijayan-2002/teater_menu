import { Send, CalendarClock, Clock3, Users } from "lucide-react";
import { formatCampaignDate } from "../../../utils/whatsappCampaign";

export default function CampaignStepSchedule({
  campaign,
  update,
}) {
  const mode =
    campaign.schedule.mode;

  const recipientCount =
    campaign.audience
      .recipientCount || 0;

  return (
    <section className="campaign-builder-card">

      <div className="campaign-section-heading">

        <div>
          <span className="campaign-step-kicker">
            STEP 4
          </span>

          <h3>
            Schedule & Final Review
          </h3>

          <p>
            Choose when the campaign
            should be delivered.
          </p>
        </div>

      </div>

      <div className="campaign-send-options">

        <button
          type="button"
          className={
            mode === "NOW"
              ? "campaign-send-option active"
              : "campaign-send-option"
          }
          onClick={() =>
            update(
              "schedule.mode",
              "NOW"
            )
          }
        >

          <div className="campaign-send-icon">
            <Send size={18} />
          </div>

          <div>
            <strong>
              Send Immediately
            </strong>

            <p>
              Start the campaign after
              it is approved and saved.
            </p>
          </div>

        </button>

        <button
          type="button"
          className={
            mode === "ONCE"
              ? "campaign-send-option active"
              : "campaign-send-option"
          }
          onClick={() =>
            update(
              "schedule.mode",
              "ONCE"
            )
          }
        >

          <div className="campaign-send-icon">
            <CalendarClock
              size={18}
            />
          </div>

          <div>
            <strong>
              Schedule Once
            </strong>

            <p>
              Select an exact broadcast
              date and time.
            </p>
          </div>

        </button>

      </div>

      {mode === "ONCE" && (
        <div className="campaign-grid">

          <label>
            Broadcast Date & Time

            <input
              type="datetime-local"
              value={
                campaign.schedule
                  .scheduledAt
              }
              onChange={(e) =>
                update(
                  "schedule.scheduledAt",
                  e.target.value
                )
              }
            />

            {campaign.schedule
              .scheduledAt && (
              <small>
                {formatCampaignDate(
                  campaign.schedule
                    .scheduledAt
                )}
              </small>
            )}
          </label>

          <label>
            Timezone

            <select
              value={
                campaign.schedule
                  .timezone
              }
              onChange={(e) =>
                update(
                  "schedule.timezone",
                  e.target.value
                )
              }
            >
              <option value="Asia/Kolkata">
                India — Asia/Kolkata
              </option>

              <option value="UTC">
                UTC
              </option>

              <option value="Asia/Dubai">
                Dubai — Asia/Dubai
              </option>

              <option value="Asia/Singapore">
                Singapore — Asia/Singapore
              </option>
            </select>
          </label>

        </div>
      )}

      <div className="campaign-review-card">

        <div className="campaign-review-header">

          <div>
            <span>
              CAMPAIGN REVIEW
            </span>

            <h4>
              {campaign.name ||
                "Untitled Campaign"}
            </h4>
          </div>

          <Clock3
            size={20}
          />

        </div>

        <div className="campaign-review-grid">

          <ReviewItem
            label="Audience"
            value={
              campaign.audience
                .segmentId ||
              "Not selected"
            }
          />

          <ReviewItem
            label="Recipients"
            value={
              recipientCount
                ? `${recipientCount}`
                : "Not selected"
            }
          />

          <ReviewItem
            label="Template"
            value={
              campaign.whatsapp
                .templateName ||
              "Not selected"
            }
          />

          <ReviewItem
            label="Header"
            value={
              campaign.whatsapp
                .header.type
            }
          />

          <ReviewItem
            label="Buttons"
            value={
              `${campaign.whatsapp.buttons.length} / 3`
            }
          />

          <ReviewItem
            label="Delivery"
            value={
              mode === "NOW"
                ? "Immediately"
                : formatCampaignDate(
                    campaign.schedule
                      .scheduledAt
                  )
            }
          />

        </div>

      </div>

      <div className="campaign-safety-notice">

        <Users size={18} />

        <div>

          <strong>
            WhatsApp recipient protection
          </strong>

          <p>
            Only send marketing messages
            to customers who have the
            required WhatsApp marketing
            consent. The backend should
            enforce Meta's messaging
            and template requirements.
          </p>

        </div>

      </div>

    </section>
  );
}

function ReviewItem({
  label,
  value,
}) {
  return (
    <div className="campaign-review-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}