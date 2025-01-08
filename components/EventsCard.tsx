"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";

interface EventsCardProps {
  eventId: Id<"events">;
}

const EventsCard = ({ eventId }: EventsCardProps) => {
  const { user } = useUser();
  const router = useRouter();

  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const userTickets = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  return <div>EventsCard</div>;
};

export default EventsCard;
