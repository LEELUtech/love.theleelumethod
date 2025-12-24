"use client";
import UserDataModal from "@/components/ui/userModal/UserDataModal";

export default function WebinarModalButton() {
  return (
    <UserDataModal
      trigger={open => (
        <button className="px-4 py-2 border rounded hover:bg-gray-100 transition" onClick={open}>
          Webinar CTA
        </button>
      )}
      onSuccess={() => {
        window.location.href = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
      }}
    />
  );
}