import EventForm from "@/components/EventForm";
import React from "react";

const NewEventPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-blue-100 mt-2">
            List your event and start selling tickets
          </p>
        </div>

        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
};

export default NewEventPage;
