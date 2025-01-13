"use client";
import { createStripeConnectLoginLink } from "@/actions/createStripeConnectLoginLink";
import {
  AccountStatus,
  getStripeConnectAccountStatus,
} from "@/actions/getStripeConnectAccountStatus";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { createStripeConnectCutomer } from "@/actions/createStripeConnectCutomer";

const SellerDashboard = () => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );

  const router = useRouter();
  const { user } = useUser();
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus();
    }
  }, [stripeConnectId]);

  if (stripeConnectId === undefined) {
    return <Spinner />;
  }

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  const handleManagement = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error("Error creating Stripe Connect login link:", error);
      setError(true);
    }
  };

  const fetchAccountStatus = async () => {
    if (stripeConnectId) {
      try {
        const status = await getStripeConnectAccountStatus(stripeConnectId);
        setAccountStatus(status);
      } catch (error) {
        console.error("Error fetching Stripe Connect account status:", error);
      }
    }
  };

  return (
    <div className="min-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-blue-100 mt-2">
            Manage your seller profile and payment settings.
          </p>
        </div>
        {/* Main Content */}
        {isReadyToAcceptPayments && (
          <>
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Sell tickets for your events.
              </h2>
              <p className="text-gray-600 mb-8">
                List your tickets for sale and manage your listing.
              </p>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href={"/seller/new-event"}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Event
                  </Link>
                  <Link
                    href={"/seller/events"}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <CalendarDays className="w-5 h-5" />
                    View My Events
                  </Link>
                </div>
              </div>
            </div>
            <hr className="my-8" />
          </>
        )}

        <div className="p-6">
          {/* Account Creation Section */}
          {!stripeConnectId && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">
                Start Accepting Payments
              </h3>
              <p className="text-gray-600 mb-6">
                Create your seller account to start receiving payments securely
                through Stripe
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    await createStripeConnectCutomer();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error(
                      "Error creating Stripe Connect customer:",
                      error
                    );
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Seller Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
