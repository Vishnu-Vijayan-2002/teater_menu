import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "./firebase";

const CAMPAIGNS_COLLECTION = "campaigns";

const campaignsRef = collection(
  db,
  CAMPAIGNS_COLLECTION
);

/**
 * Get all campaigns.
 */
export async function getCampaigns() {
  const q = query(
    campaignsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/**
 * Get campaigns by status.
 */
export async function getCampaignsByStatus(
  status
) {
  const q = query(
    campaignsRef,
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/**
 * Create campaign.
 */
export async function createCampaign(
  campaign,
  userId = null
) {
  const validation =
    validateCampaign(campaign);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  const payload = {
    ...campaign,

    createdBy:
      userId || campaign.createdBy || null,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(
    campaignsRef,
    payload
  );

  return {
    id: ref.id,
    ...campaign,
  };
}

/**
 * Update campaign.
 */
export async function updateCampaign(
  campaignId,
  campaign
) {
  if (!campaignId) {
    throw new Error(
      "Campaign ID is required."
    );
  }

  const validation =
    validateCampaign(campaign);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  await updateDoc(
    doc(
      db,
      CAMPAIGNS_COLLECTION,
      campaignId
    ),
    {
      ...campaign,
      updatedAt: serverTimestamp(),
    }
  );
}

/**
 * Delete campaign.
 */
export async function deleteCampaign(
  campaignId
) {
  if (!campaignId) {
    throw new Error(
      "Campaign ID is required."
    );
  }

  await deleteDoc(
    doc(
      db,
      CAMPAIGNS_COLLECTION,
      campaignId
    )
  );
}

/**
 * Save campaign as draft.
 */
export async function saveCampaignDraft(
  campaign,
  userId = null
) {
  return createCampaign(
    {
      ...campaign,
      status: "DRAFT",
    },
    userId
  );
}

/**
 * Upload image/video/pdf.
 */
export async function uploadCampaignMedia(
  file
) {
  if (!file) {
    throw new Error(
      "Please select a file."
    );
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Unsupported file type. Use JPG, PNG, WEBP, MP4 or PDF."
    );
  }

  const maxSize =
    file.type === "video/mp4"
      ? 50 * 1024 * 1024
      : 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      file.type === "video/mp4"
        ? "Video must be smaller than 50MB."
        : "File must be smaller than 10MB."
    );
  }

  const safeName =
    file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

  const fileName =
    `${crypto.randomUUID()}-${safeName}`;

  const storageRef = ref(
    storage,
    `campaign-media/${fileName}`
  );

  await uploadBytes(
    storageRef,
    file,
    {
      contentType: file.type,
    }
  );

  const downloadUrl =
    await getDownloadURL(storageRef);

  let mediaType = "DOCUMENT";

  if (file.type.startsWith("image/")) {
    mediaType = "IMAGE";
  }

  if (file.type.startsWith("video/")) {
    mediaType = "VIDEO";
  }

  return {
    url: downloadUrl,
    type: mediaType,
    fileName: file.name,
    contentType: file.type,
    size: file.size,
  };
}

/**
 * Campaign validation.
 */
export function validateCampaign(
  campaign
) {
  const errors = [];

  if (!campaign) {
    return {
      valid: false,
      errors: ["Campaign data is missing."],
    };
  }

  if (!campaign.name?.trim()) {
    errors.push(
      "Campaign name is required."
    );
  }

  if (
    !campaign.audience?.segmentId
  ) {
    errors.push(
      "Please select a target audience."
    );
  }

  if (
    !campaign.whatsapp?.templateName?.trim()
  ) {
    errors.push(
      "WhatsApp template name is required."
    );
  }

  if (
    !campaign.whatsapp?.body?.text?.trim()
  ) {
    errors.push(
      "Message body is required."
    );
  }

  const header =
    campaign.whatsapp?.header;

  if (
    header?.type === "TEXT" &&
    !header.text?.trim()
  ) {
    errors.push(
      "Header text is required."
    );
  }

  if (
    ["IMAGE", "VIDEO", "DOCUMENT"].includes(
      header?.type
    ) &&
    !header.mediaUrl
  ) {
    errors.push(
      "Campaign media is required."
    );
  }

  const buttons =
    campaign.whatsapp?.buttons || [];

  if (buttons.length > 3) {
    errors.push(
      "Maximum 3 buttons are allowed."
    );
  }

  buttons.forEach(
    (button, index) => {
      if (!button.text?.trim()) {
        errors.push(
          `Button ${index + 1} label is required.`
        );
      }

      if (
        button.type === "URL" &&
        !button.url?.trim()
      ) {
        errors.push(
          `Button ${index + 1} URL is required.`
        );
      }

      if (
        button.type === "PHONE" &&
        !button.phoneNumber?.trim()
      ) {
        errors.push(
          `Button ${index + 1} phone number is required.`
        );
      }
    }
  );

  if (
    campaign.schedule?.mode === "ONCE" &&
    !campaign.schedule?.scheduledAt
  ) {
    errors.push(
      "Please select a broadcast time."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}