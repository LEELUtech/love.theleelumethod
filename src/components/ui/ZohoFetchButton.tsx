"use client";

import React, { useState } from "react";

export default function ZohoFetchButton() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchZohoData = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch("/api/zoho-get-all", { method: "GET" });
      if (!res.ok) throw new Error("Ошибка запроса: " + res.status);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || "Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <button
        onClick={fetchZohoData}
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Получить все из Zoho CRM"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {data && (
        <pre className="mt-6 bg-zinc-100 text-zinc-800 p-4 rounded-xl max-w-2xl overflow-x-auto text-xs text-left">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
