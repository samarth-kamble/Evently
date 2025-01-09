"use client";

import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";

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

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  const isEventOwner = user?.id === event.userId;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
      onClick={() => router.push(`/events/${eventId}`)}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      {/* Event Details */}
      <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex flex-col items-start ">
          {/* Event Name and Owner Badge */}
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="tex-2xl font-bold  text-gray-800 mt-2">
                {event.name}
              </h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Events
              </span>
            )}
          </div>
        </div>

        {/* Price Tag*/}
        <div className="flex flex-col items-end gap-2 ml-4">
          <span
            className={`px-4 py-1.5 font-semibold rounded-full ${
              isPastEvent
                ? "bg-gray-50 text-gray-500"
                : "bg-green-50 text-green-700"
            }`}
          >
            ${event.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
