import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  // Hosted Studio URL: https://aiwar-dev.sanity.studio
  studioHost: "aiwar-dev",
  deployment: { autoUpdates: true, appId: "ec4ip02tpe80kd5mgbechekd" },
});
