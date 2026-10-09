import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./src/lib/prisma";
import { analyticsService } from "./src/modules/analytics/analytics.service";

async function main() {
  try {
    const res = await analyticsService.getAdminAnalytics({});
    console.log("Success:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
