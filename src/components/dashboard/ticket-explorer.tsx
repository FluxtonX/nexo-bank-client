"use client";



import { useMemo, useState, useEffect } from "react";

import Link from "next/link";

import { Search, Loader2 } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";



export function TicketExplorer() {

  const [query, setQuery] = useState("");

  const [tickets, setTickets] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function fetchTickets() {

      try {

        const response = await fetch("/api/support/tickets");

        const data = await response.json();

        if (data.tickets) {

          setTickets(data.tickets);

        }

      } catch (error) {

        console.error("Error fetching tickets:", error);

      } finally {

        setLoading(false);

      }

    }

    fetchTickets();

  }, []);



  const filteredTickets = useMemo(() => {

    return tickets.filter((ticket) =>

      `${ticket.id} ${ticket.category || ""} ${ticket.subject || ""} ${ticket.status || ""}`

        .toLowerCase()

        .includes(query.toLowerCase()),

    );

  }, [tickets, query]);



  if (loading) {

    return (

      <div className="flex min-h-[200px] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin text-banking-blue" />

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">

        <Search className="h-4 w-4" />

        <input

          value={query}

          onChange={(event) => setQuery(event.target.value)}

          className="h-full flex-1 bg-transparent outline-none"

          placeholder="Search tickets"

        />

      </label>

      <div className="space-y-3">

        {filteredTickets.length === 0 ? (

          <p className="text-sm text-banking-muted text-center py-4">No support tickets found.</p>

        ) : filteredTickets.map((ticket) => (

          <article key={ticket.id} className="grid gap-3 rounded-md border border-banking-border p-4 md:grid-cols-[0.7fr_1fr_0.7fr_0.7fr_110px] md:items-center">

            <p className="font-semibold text-banking-blue">{ticket.id}</p>

            <p className="font-medium">{ticket.subject || "Support Request"}</p>

            <p className="text-sm text-banking-muted">{(ticket.category || "general").replaceAll("_", " ")}</p>

            <StatusBadge status={ticket.status?.toLowerCase() || "open"} />

            <Link href={`/support/tickets/${ticket.id}`} className="rounded-md border border-banking-border px-3 py-2 text-center text-sm font-semibold">

              Open

            </Link>

          </article>

        ))}

      </div>

    </div>

  );

}

