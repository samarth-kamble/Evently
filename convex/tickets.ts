import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserTicketForEvent = query({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId)
      )
      .first();

    return ticket;
  },
});
