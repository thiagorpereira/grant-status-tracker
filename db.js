// eslint-disable-next-line @typescript-eslint/no-require-imports
const { faker } = require("@faker-js/faker");

const data = {
  grants: [
    {
      id: 1,
      daf_name: "John Doe Pereira",
      organization_id: 1,
      amount_in_cents: 10000_00,

      // Options: 'check', 'ach', 'wire'
      modality: "check",

      // Options: 'wherever_needed_most', 'specific_need', 'research_and_development', 'infrastructure', 'education_and_training', 'other'
      designation: "specific_need",

      // Nullable, except for when designation is 'specific_need' or 'other'
      notes: "For the 2030 ESG carbon offset project.",

      // Grants must be reviewed before they can be sent. If it's rejected, then the status moves to the final 'failed' status.
      is_reviewed: true,

      /**
       * Options: 'pending', 'sent', 'delivered', 'deposited', 'failed'
       *
       * 'deposited' and 'failed' are final statuses.
       */
      status: "sent",

      // Nullable, except for when status reaches 'sent'
      sent_at: "2024-12-12T16:00:00Z",

      // Nullable, except for when status reaches 'delivered'
      delivered_at: null,

      // Nullable, except for when status reaches 'deposited'
      deposited_at: null,

      /**
       * Nullable, except for when status is 'failed'.
       *
       * 'deposited' grants cannot be transitioned to 'failed', all other statuses can.
       */
      failed_at: null,

      created_at: "2024-12-10T10:00:00Z",
      updated_at: "2024-12-11T15:30:00Z",
    },
  ],
  organizations: [
    {
      id: 1,
      name: "Charityvest",
      ein: "81-2771871",
      address: {
        street1: "75 5th St NW",
        street2: "Suite 2200",
        city: "Atlanta",
        state: "GA",
        zip: "30308",
      },
    },
  ],

  /**
   * Templates for UI descriptions are as follows.
   *
   * grant_created: "New grant from {daf_name}'s DAF for ${amount_in_cents} to {organization_name} (EIN: {organization_ein})."
   * manual_review: "Manually reviewed grant from {daf_name}'s DAF for ${amount_in_cents} to {organization_name} (EIN: {organization_ein})."
   * status_change: "Status changed from {before_status} to {after_status} for grant from {daf_name}'s DAF for ${amount_in_cents} to {organization_name} (EIN: {organization_ein})."
   */
  activities: [
    {
      id: 1,
      grant_id: 1,
      activity_type: "grant_created",
      created_at: "2024-12-10T10:00:00Z",
    },
    {
      id: 2,
      grant_id: 1,
      activity_type: "manual_review",
      created_at: "2024-12-11T15:30:00Z",
    },
    {
      id: 3,
      grant_id: 1,
      activity_type: "status_change",
      before_status: "pending",
      after_status: "sent",
      created_at: "2024-12-08T12:00:00Z",
    },
  ],
};

const extraFakerData = generateFakeData(
  9 // we will have 10 grants in total, including the static one above
);

data.grants = data.grants.concat(extraFakerData.grants);
data.organizations = data.organizations.concat(extraFakerData.organizations);
data.activities = data.activities.concat(extraFakerData.activities);

module.exports = data;

// Code from below on is AI-generated and doesn't need to be reviewed.
// Code from below on is AI-generated and doesn't need to be reviewed.
// Code from below on is AI-generated and doesn't need to be reviewed.
// Code from below on is AI-generated and doesn't need to be reviewed.
// Code from below on is AI-generated and doesn't need to be reviewed.
function generateFakeData(records = 10) {
  const grants = [];
  const organizations = [];
  const activities = [];

  // Generate organizations
  for (let i = 0; i < records; i++) {
    const orgId = data.organizations.length + organizations.length + 1;
    organizations.push({
      id: orgId,
      name: faker.company.name(),
      ein: faker.helpers.replaceSymbols("##-#######"),
      address: {
        street1: faker.location.streetAddress(),
        street2: faker.datatype.boolean()
          ? faker.location.secondaryAddress()
          : null,
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
      },
    });
  }

  /**
   * Possible designations:
   * 'wherever_needed_most',
   * 'specific_need',
   * 'research_and_development',
   * 'infrastructure',
   * 'education_and_training',
   * 'other'
   *
   * Possible modalities: 'check', 'ach', 'wire'
   *
   * Desired final distribution of outcomes:
   * - 20% pending (never reviewed)
   * - 30% sent (reviewed & accepted, but stop at sent)
   * - 10% delivered (reviewed & accepted, go to delivered)
   * - 30% deposited (reviewed & accepted, go to deposited)
   * - 10% failed (reviewed & rejected)
   *
   * If designation = 'specific_need' or 'other', notes must be filled.
   */

  const designations = [
    "wherever_needed_most",
    "specific_need",
    "research_and_development",
    "infrastructure",
    "education_and_training",
    "other",
  ];
  const modalities = ["check", "ach", "wire"];
  const notesRequiredDesignations = ["specific_need", "other"];

  for (let i = 0; i < records; i++) {
    const grantId = data.grants.length + grants.length + 1;
    const org = faker.helpers.arrayElement(organizations);
    const designation = faker.helpers.arrayElement(designations);
    const modality = faker.helpers.arrayElement(modalities);

    const outcome = weightedChoice([
      { outcome: "pending", weight: 20 },
      { outcome: "sent", weight: 30 },
      { outcome: "delivered", weight: 10 },
      { outcome: "deposited", weight: 30 },
      { outcome: "failed", weight: 10 },
    ]);

    let isReviewed = false;
    let status = "pending";
    let sentAt = null;
    let deliveredAt = null;
    let depositedAt = null;
    let failedAt = null;

    // Start with a baseline time
    let baseTime = new Date();
    baseTime.setFullYear(baseTime.getFullYear() - 1); // 1 year in the past
    const createdAt = nextTimestamp(baseTime, modality);
    let currentTime = new Date(createdAt);

    const activitiesForGrant = [];
    let nextActivityId = data.activities.length + activities.length + 1;

    // grant_created activity
    let activityTime = nextTimestamp(currentTime, modality);
    activitiesForGrant.push({
      id: nextActivityId++,
      grant_id: grantId,
      activity_type: "grant_created",
      created_at: activityTime,
    });
    currentTime = new Date(activityTime);

    if (outcome === "pending") {
      // not reviewed, stays pending
      isReviewed = false;
    } else if (outcome === "failed") {
      // reviewed & rejected: pending -> failed
      isReviewed = true;

      // manual_review
      activityTime = nextTimestamp(currentTime, modality);
      activitiesForGrant.push({
        id: nextActivityId++,
        grant_id: grantId,
        activity_type: "manual_review",
        created_at: activityTime,
      });
      currentTime = new Date(activityTime);

      const beforeStatus = status;
      failedAt = nextTimestamp(currentTime, modality);
      activitiesForGrant.push({
        id: nextActivityId++,
        grant_id: grantId,
        activity_type: "status_change",
        before_status: beforeStatus,
        after_status: "failed",
        created_at: failedAt,
      });
      status = "failed";
      currentTime = new Date(failedAt);
    } else {
      // All other outcomes are accepted:
      isReviewed = true;

      // manual_review
      activityTime = nextTimestamp(currentTime, modality);
      activitiesForGrant.push({
        id: nextActivityId++,
        grant_id: grantId,
        activity_type: "manual_review",
        created_at: activityTime,
      });
      currentTime = new Date(activityTime);

      // pending -> sent
      const beforePending = status;
      sentAt = nextTimestamp(currentTime, modality);
      activitiesForGrant.push({
        id: nextActivityId++,
        grant_id: grantId,
        activity_type: "status_change",
        before_status: beforePending,
        after_status: "sent",
        created_at: sentAt,
      });
      status = "sent";
      currentTime = new Date(sentAt);

      if (outcome === "delivered" || outcome === "deposited") {
        // sent -> delivered
        const beforeSent = status;
        deliveredAt = nextTimestamp(currentTime, modality);
        activitiesForGrant.push({
          id: nextActivityId++,
          grant_id: grantId,
          activity_type: "status_change",
          before_status: beforeSent,
          after_status: "delivered",
          created_at: deliveredAt,
        });
        status = "delivered";
        currentTime = new Date(deliveredAt);

        if (outcome === "deposited") {
          // delivered -> deposited
          const beforeDelivered = status;
          depositedAt = nextTimestamp(currentTime, modality);
          activitiesForGrant.push({
            id: nextActivityId++,
            grant_id: grantId,
            activity_type: "status_change",
            before_status: beforeDelivered,
            after_status: "deposited",
            created_at: depositedAt,
          });
          status = "deposited";
          currentTime = new Date(depositedAt);
        }
      }
    }

    // Determine finalTimestamp by picking the latest of all known timestamps
    const candidateTimes = [
      failedAt,
      depositedAt,
      deliveredAt,
      sentAt,
      createdAt,
    ]
      .filter(Boolean)
      .map((t) => new Date(t));
    let finalTimestamp = new Date(createdAt);
    for (const t of candidateTimes) {
      if (t > finalTimestamp) finalTimestamp = t;
    }

    const updatedAt = nextTimestamp(finalTimestamp, modality);
    const notes = notesRequiredDesignations.includes(designation)
      ? faker.lorem.sentence()
      : null;

    grants.push({
      id: grantId,
      daf_name: faker.person.fullName(),
      organization_id: org.id,
      amount_in_cents: faker.number.int({ min: 10000, max: 10000000 }),
      modality,
      designation,
      notes,
      is_reviewed: isReviewed,
      status,
      sent_at: sentAt,
      delivered_at: deliveredAt,
      deposited_at: depositedAt,
      failed_at: failedAt,
      created_at: createdAt,
      updated_at: updatedAt,
    });

    activities.push(...activitiesForGrant);
  }

  return { grants, organizations, activities };
}

/**
 * Selects an outcome from a weighted distribution array.
 */
function weightedChoice(choices) {
  const totalWeight = choices.reduce((sum, c) => sum + c.weight, 0);
  const r = Math.random() * totalWeight;
  let sum = 0;
  for (const choice of choices) {
    sum += choice.weight;
    if (r <= sum) {
      return choice.outcome;
    }
  }
  return choices[choices.length - 1].outcome;
}

/**
 * Generates a strictly future timestamp after `afterDate` based on the modality:
 *
 * For wire: increments between 30 minutes and 6 hours
 * For ach: increments between 6 hours and 3 days
 * For check: increments between 1 day and 21 days
 */
function nextTimestamp(afterDate, modality) {
  let minIncrementMs;
  let maxIncrementMs;
  switch (modality) {
    case "wire":
      // 30 minutes to 6 hours
      minIncrementMs = 30 * 60 * 1000;
      maxIncrementMs = 6 * 60 * 60 * 1000;
      break;
    case "ach":
      // 6 hours to 3 days
      minIncrementMs = 6 * 60 * 60 * 1000;
      maxIncrementMs = 3 * 24 * 60 * 60 * 1000;
      break;
    case "check":
      // 1 day to 21 days
      minIncrementMs = 24 * 60 * 60 * 1000;
      maxIncrementMs = 21 * 24 * 60 * 60 * 1000;
      break;
    default:
      // Default behavior similar to ach if unknown
      minIncrementMs = 6 * 60 * 60 * 1000;
      maxIncrementMs = 3 * 24 * 60 * 60 * 1000;
      break;
  }
  const increment = faker.number.int({
    min: minIncrementMs,
    max: maxIncrementMs,
  });
  return new Date(afterDate.getTime() + increment).toISOString();
}