export const CAMPAIGN_STATUS = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  PAUSED: "PAUSED",
  FAILED: "FAILED",
};

export const HEADER_TYPES = {
  NONE: "NONE",
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  DOCUMENT: "DOCUMENT",
};

export const BUTTON_TYPES = {
  URL: "URL",
  PHONE: "PHONE",
  QUICK_REPLY: "QUICK_REPLY",
};

export const AUDIENCE_TYPES = {
  SEGMENT: "SEGMENT",
  ALL: "ALL",
  CUSTOM: "CUSTOM",
};

export const DEFAULT_VARIABLES = [
  {
    token: "{{1}}",
    key: "customer_name",
    label: "Client Name",
    fallback: "Customer",
  },

  {
    token: "{{2}}",
    key: "movie_title",
    label: "Movie Title",
    fallback: "Movie",
  },

  {
    token: "{{3}}",
    key: "booking_url",
    label: "Booking URL",
    fallback: "https://example.com",
  },

  {
    token: "{{4}}",
    key: "discount",
    label: "Discount",
    fallback: "15%",
  },
];

export const DEFAULT_CAMPAIGN = {
  name: "",

  type: "WHATSAPP_MARKETING",

  audience: {
    type: AUDIENCE_TYPES.SEGMENT,
    segmentId: "",
    recipientCount: 0,
  },

  whatsapp: {
    templateName: "",
    templateLanguage: "en",

    header: {
      type: HEADER_TYPES.NONE,
      text: "",
      mediaUrl: "",
      mediaType: "",
      fileName: "",
    },

    body: {
      text:
        "Hi {{1}},\n\n" +
        "🎬 {{2}} is now available!\n\n" +
        "Book your tickets today.",
      variables: [],
    },

    footer: {
      text: "",
    },

    buttons: [],
  },

  schedule: {
    mode: "NOW",
    scheduledAt: "",
    timezone: "Asia/Kolkata",
  },

  stats: {
    totalRecipients: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
  },

  status: CAMPAIGN_STATUS.DRAFT,
};

/**
 * Deep clone campaign.
 */
export function cloneCampaign(
  campaign = DEFAULT_CAMPAIGN
) {
  return JSON.parse(
    JSON.stringify(campaign)
  );
}

/**
 * Detect {{1}}, {{2}}, etc.
 */
export function extractVariables(text = "") {
  const matches =
    text.match(/\{\{\d+\}\}/g) || [];

  return [
    ...new Set(matches),
  ].sort((a, b) => {
    const numberA =
      Number(
        a.replace(/[^\d]/g, "")
      );

    const numberB =
      Number(
        b.replace(/[^\d]/g, "")
      );

    return numberA - numberB;
  });
}

/**
 * Get variable metadata.
 */
export function getVariableDefinition(
  token
) {
  return (
    DEFAULT_VARIABLES.find(
      (item) =>
        item.token === token
    ) || {
      token,
      key: token,
      label: token,
      fallback: "",
    }
  );
}

/**
 * Convert variables into Firestore format.
 */
export function buildVariableConfig(
  text
) {
  return extractVariables(text).map(
    (token) => {
      const definition =
        getVariableDefinition(token);

      return {
        position: Number(
          token.replace(/[^\d]/g, "")
        ),

        token,

        key: definition.key,

        label: definition.label,

        fallback:
          definition.fallback,
      };
    }
  );
}

/**
 * Replace variables for preview.
 */
export function renderPreviewText(
  text = "",
  values = {}
) {
  let result = text;

  extractVariables(text).forEach(
    (token) => {
      const definition =
        getVariableDefinition(token);

      const value =
        values[definition.key] ??
        definition.fallback ??
        token;

      result = result.replaceAll(
        token,
        String(value)
      );
    }
  );

  return result;
}

/**
 * Build Meta-compatible component
 * configuration.
 *
 * Actual API request should be
 * generated on the backend.
 */
export function buildTemplateComponents(
  campaign
) {
  const components = [];

  const whatsapp =
    campaign?.whatsapp;

  if (!whatsapp) {
    return components;
  }

  const header =
    whatsapp.header;

  if (header?.type === "TEXT") {
    components.push({
      type: "HEADER",
      format: "TEXT",
      text: header.text,
    });
  }

  if (header?.type === "IMAGE") {
    components.push({
      type: "HEADER",
      format: "IMAGE",
      example: {
        header_handle: [
          header.mediaUrl,
        ],
      },
    });
  }

  if (header?.type === "VIDEO") {
    components.push({
      type: "HEADER",
      format: "VIDEO",
      example: {
        header_handle: [
          header.mediaUrl,
        ],
      },
    });
  }

  if (header?.type === "DOCUMENT") {
    components.push({
      type: "HEADER",
      format: "DOCUMENT",
      example: {
        header_handle: [
          header.mediaUrl,
        ],
      },
    });
  }

  const variables =
    whatsapp.body?.variables || [];

  if (variables.length) {
    components.push({
      type: "BODY",

      parameters:
        variables.map(
          (variable) => ({
            type: "text",
            parameter_name:
              variable.key,
          })
        ),
    });
  }

  return components;
}

/**
 * Validate URL.
 */
export function isValidUrl(
  value
) {
  if (!value) {
    return false;
  }

  try {
    const url =
      new URL(value);

    return [
      "http:",
      "https:",
    ].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate phone.
 */
export function isValidPhone(
  value
) {
  return /^\+[1-9]\d{7,14}$/.test(
    value || ""
  );
}

/**
 * Validate buttons.
 */
export function validateButtons(
  buttons = []
) {
  const errors = [];

  if (buttons.length > 3) {
    errors.push(
      "Maximum 3 buttons are allowed."
    );
  }

  buttons.forEach(
    (button, index) => {
      const number =
        index + 1;

      if (!button.text?.trim()) {
        errors.push(
          `Button ${number}: label is required.`
        );
      }

      if (
        button.type === "URL" &&
        !isValidUrl(button.url)
      ) {
        errors.push(
          `Button ${number}: valid website URL is required.`
        );
      }

      if (
        button.type === "PHONE" &&
        !isValidPhone(
          button.phoneNumber
        )
      ) {
        errors.push(
          `Button ${number}: phone must use international format.`
        );
      }
    }
  );

  return errors;
}

/**
 * Generate campaign status.
 */
export function getCampaignStatus(
  campaign
) {
  if (
    campaign?.status
  ) {
    return campaign.status;
  }

  if (
    campaign?.schedule?.mode ===
    "ONCE"
  ) {
    return CAMPAIGN_STATUS.SCHEDULED;
  }

  return CAMPAIGN_STATUS.DRAFT;
}

/**
 * Format campaign date.
 */
export function formatCampaignDate(
  value
) {
  if (!value) {
    return "Not scheduled";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Invalid date";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

