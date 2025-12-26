"use client";
import UserDataModal from '@/components/ui/userModal/UserDataModal';

export default function JoinProgramButton() {
  return (
    <UserDataModal
      trigger={open => (
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-xl text-lg shadow-md transition-all duration-200"
          onClick={open}
        >
          Join Program
        </button>
      )}
      title="Join Program"
    />
  );
}
