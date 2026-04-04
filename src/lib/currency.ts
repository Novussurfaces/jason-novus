"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Types ── */
export type Currency = "CAD" | "USD" | "EUR" | "GBP";

export type ExchangeRates = {
  USD: number;
  EUR: number;
  GBP: number;
};

type CachedRates = {
  rates: ExchangeRates;
  timestamp: number;
};

/* ── Constants ── */
const CACHE_KEY = "novus_exchange_rates";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms
const API_URL = "https://api.frankfurter.dev/v1/latest?base=CAD&symbols=USD,EUR,GBP";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CAD: "$",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

const CURRENCY_CODES: Record<Currency, string> = {
  CAD: "CAD",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

/* ── localStorage helpers ── */
function getCachedRates(): CachedRates | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedRates = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedRates(rates: ExchangeRates): void {
  if (typeof window === "undefined") return;
  try {
    const data: CachedRates = { rates, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/* ── Fetch rates ── */
async function fetchRates(): Promise<ExchangeRates> {
  const cached = getCachedRates();
  if (cached) return cached.rates;

  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);
  const data = await res.json();
  const rates: ExchangeRates = {
    USD: data.rates.USD,
    EUR: data.rates.EUR,
    GBP: data.rates.GBP,
  };
  setCachedRates(rates);
  return rates;
}

/* ── Hook ── */
export function useCurrency() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("CAD");

  /* Hydrate selected currency from localStorage */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("novus_currency");
    if (saved && ["CAD", "USD", "EUR", "GBP"].includes(saved)) {
      setSelectedCurrency(saved as Currency);
    }
  }, []);

  /* Persist selection */
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("novus_currency", selectedCurrency);
  }, [selectedCurrency]);

  /* Fetch exchange rates on mount */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRates()
      .then((r) => {
        if (!cancelled) {
          setRates(r);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback rates if API fails
          setRates({ USD: 0.74, EUR: 0.67, GBP: 0.58 });
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Convert CAD amount to target currency */
  const convert = useCallback(
    (amountCAD: number, targetCurrency?: Currency): number => {
      const target = targetCurrency ?? selectedCurrency;
      if (target === "CAD" || !rates) return amountCAD;
      return Math.round(amountCAD * rates[target] * 100) / 100;
    },
    [rates, selectedCurrency]
  );

  /* Format a CAD amount as a localized price string in the target currency */
  const formatPrice = useCallback(
    (amountCAD: number, targetCurrency?: Currency): string => {
      const target = targetCurrency ?? selectedCurrency;
      const converted = convert(amountCAD, target);
      const symbol = CURRENCY_SYMBOLS[target];
      const code = CURRENCY_CODES[target];

      // Format with 2 decimal places and thousands separator
      const formatted = converted.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `${symbol}${formatted} ${code}`;
    },
    [convert, selectedCurrency]
  );

  return {
    convert,
    formatPrice,
    selectedCurrency,
    setSelectedCurrency,
    rates,
    loading,
  };
}
