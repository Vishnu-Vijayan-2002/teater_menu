import {
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
} from "lucide-react";

import CampaignStepDetails
  from "./CampaignStepDetails";

import CampaignStepMessage
  from "./CampaignStepMessage";

import CampaignStepButtons
  from "./CampaignStepButtons";

import CampaignStepSchedule
  from "./CampaignStepSchedule";

import WhatsAppPreview
  from "./WhatsAppPreview";
import {
  DEFAULT_CAMPAIGN,
  cloneCampaign,
  buildVariableConfig,
} from "../../../utils/whatsappCampaign";

import {
  uploadCampaignMedia,
  validateCampaign,
} from "../../../services/campaignService";
const STEPS = [
  {
    id: "details",
    title: "Campaign Details",
    shortTitle: "Details",
  },

  {
    id: "message",
    title: "Message & Media",
    shortTitle: "Message",
  },

  {
    id: "buttons",
    title: "Interactive Buttons",
    shortTitle: "Buttons",
  },

  {
    id: "schedule",
    title: "Schedule & Preview",
    shortTitle: "Schedule",
  },
];

export default function CampaignBuilder({
  initialCampaign = null,
  onSubmit,
  onCancel,
}) {
  const [step, setStep] =
    useState(0);

  const [campaign, setCampaign] =
    useState(() =>
      cloneCampaign(
        initialCampaign ||
          DEFAULT_CAMPAIGN
      )
    );

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /**
   * Generic nested state updater.
   */
  function update(
    path,
    value
  ) {
    setCampaign(
      (current) => {
        const next =
          cloneCampaign(
            current
          );

        const parts =
          path.split(".");

        let target =
          next;

        for (
          let i = 0;
          i < parts.length - 1;
          i++
        ) {
          target =
            target[
              parts[i]
            ];
        }

        target[
          parts[
            parts.length - 1
          ]
        ] = value;

        return next;
      }
    );

    setError("");
  }

  /**
   * Upload campaign media.
   */
  async function handleUploadMedia(
    file
  ) {
    try {
      setUploading(true);
      setError("");

      const uploaded =
        await uploadCampaignMedia(
          file
        );

      update(
        "whatsapp.header",
        {
          ...campaign.whatsapp
            .header,

          mediaUrl:
            uploaded.url,

          mediaType:
            uploaded.type,

          fileName:
            uploaded.fileName,
        }
      );

    } catch (err) {
      console.error(
        err
      );

      setError(
        err.message ||
          "Media upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  /**
   * Validate current step.
   */
  function validateStep(
    stepIndex
  ) {
    const whatsapp =
      campaign.whatsapp;

    if (stepIndex === 0) {
      if (
        !campaign.name.trim()
      ) {
        return "Campaign name is required.";
      }

      if (
        !campaign.audience
          .segmentId
      ) {
        return "Please select a target audience.";
      }

      if (
        !whatsapp.templateName.trim()
      ) {
        return "WhatsApp template name is required.";
      }
    }

    if (stepIndex === 1) {
      if (
        !whatsapp.body.text.trim()
      ) {
        return "Message body is required.";
      }

      const header =
        whatsapp.header;

      if (
        header.type ===
          "TEXT" &&
        !header.text.trim()
      ) {
        return "Header text is required.";
      }

      if (
        [
          "IMAGE",
          "VIDEO",
          "DOCUMENT",
        ].includes(
          header.type
        ) &&
        !header.mediaUrl
      ) {
        return "Please upload campaign media.";
      }
    }

    if (stepIndex === 2) {
      for (
        const button of
          whatsapp.buttons
      ) {
        if (
          !button.text?.trim()
        ) {
          return "Every button needs a label.";
        }

        if (
          button.type ===
            "URL" &&
          !button.url?.trim()
        ) {
          return "Website button needs a URL.";
        }

        if (
          button.type ===
            "PHONE" &&
          !button.phoneNumber?.trim()
        ) {
          return "Call button needs a phone number.";
        }
      }
    }

    if (stepIndex === 3) {
      if (
        campaign.schedule.mode ===
          "ONCE" &&
        !campaign.schedule
          .scheduledAt
      ) {
        return "Please select a broadcast date and time.";
      }
    }

    return "";
  }

  /**
   * Go next.
   */
  function nextStep() {
    const validation =
      validateStep(step);

    if (validation) {
      setError(
        validation
      );

      return;
    }

    setError("");

    setStep(
      (current) =>
        Math.min(
          STEPS.length - 1,
          current + 1
        )
    );
  }

  /**
   * Go previous.
   */
  function previousStep() {
    setError("");

    setStep(
      (current) =>
        Math.max(
          0,
          current - 1
        )
    );
  }

  /**
   * Final save.
   */
  async function handleSave() {
    for (
      let index = 0;
      index < STEPS.length;
      index++
    ) {
      const validation =
        validateStep(
          index
        );

      if (validation) {
        setStep(index);
        setError(validation);

        return;
      }
    }

    const finalCampaign =
      cloneCampaign(
        campaign
      );

    finalCampaign.whatsapp.body.variables =
      buildVariableConfig(
        finalCampaign.whatsapp
          .body.text
      );

    finalCampaign.status =
      finalCampaign.schedule.mode ===
      "NOW"
        ? "RUNNING"
        : "SCHEDULED";

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (onSubmit) {
        await onSubmit(
          finalCampaign
        );
      }

      setSuccess(
        "Campaign saved successfully."
      );

    } catch (err) {
      console.error(
        err
      );

      setError(
        err.message ||
          "Failed to save campaign."
      );
    } finally {
      setSaving(false);
    }
  }

  const currentStep =
    STEPS[step];

  const progress =
    ((step + 1) /
      STEPS.length) *
    100;

  return (
    <div className="campaign-builder-page">

      <div className="campaign-builder-topbar">

        <div>

          <span className="campaign-page-kicker">
            WHATSAPP MARKETING
          </span>

          <h2>
            Create Campaign
          </h2>

          <p>
            Build, preview and schedule
            an automated WhatsApp campaign.
          </p>

        </div>

        {onCancel && (
          <button
            type="button"
            className="secondary-admin-button"
            onClick={
              onCancel
            }
          >
            Cancel
          </button>
        )}

      </div>

      <div className="campaign-progress">

        <div
          className="campaign-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="campaign-builder-layout">

        <main>

          <div className="campaign-stepper">

            {STEPS.map(
              (
                item,
                index
              ) => {
                const completed =
                  index <
                  step;

                const active =
                  index ===
                  step;

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    className={
                      active
                        ? "campaign-step active"
                        : completed
                        ? "campaign-step completed"
                        : "campaign-step"
                    }
                    onClick={() => {
                      if (
                        index <=
                        step
                      ) {
                        setStep(
                          index
                        );
                      }
                    }}
                  >

                    <span>

                      {completed ? (
                        <Check
                          size={
                            14
                          }
                        />
                      ) : (
                        index +
                        1
                      )}

                    </span>

                    <div>

                      <strong>
                        {
                          item.shortTitle
                        }
                      </strong>

                      <small>
                        {
                          item.title
                        }
                      </small>

                    </div>

                  </button>
                );
              }
            )}

          </div>

          {error && (
            <div className="campaign-error">
              {error}
            </div>
          )}

          {success && (
            <div className="campaign-success">
              {success}
            </div>
          )}

          {step === 0 && (
            <CampaignStepDetails
              campaign={
                campaign
              }
              update={
                update
              }
            />
          )}

          {step === 1 && (
            <CampaignStepMessage
              campaign={
                campaign
              }
              update={
                update
              }
              onUploadMedia={
                handleUploadMedia
              }
              uploading={
                uploading
              }
            />
          )}

          {step === 2 && (
            <CampaignStepButtons
              campaign={
                campaign
              }
              update={
                update
              }
            />
          )}

          {step === 3 && (
            <CampaignStepSchedule
              campaign={
                campaign
              }
              update={
                update
              }
            />
          )}

          <div className="campaign-builder-footer">

            <button
              type="button"
              className="secondary-admin-button"
              disabled={
                step === 0 ||
                saving
              }
              onClick={
                previousStep
              }
            >
              <ChevronLeft
                size={16}
              />

              Back
            </button>

            <div>

              {step <
                STEPS.length -
                  1 ? (
                <button
                  type="button"
                  className="primary-admin-button"
                  onClick={
                    nextStep
                  }
                >
                  Continue

                  <ChevronRight
                    size={16}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-admin-button"
                  disabled={
                    saving
                  }
                  onClick={
                    handleSave
                  }
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save
                        size={
                          16
                        }
                      />

                      Save Campaign
                    </>
                  )}
                </button>
              )}

            </div>

          </div>

        </main>

        <WhatsAppPreview
          campaign={
            campaign
          }
        />

      </div>

    </div>
  );
}