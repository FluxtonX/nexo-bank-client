"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function DeleteTicketButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ticket and its conversation?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/support/tickets/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete ticket");
      
      notify({
        title: "Ticket Deleted",
        description: "The support ticket has been permanently removed.",
        type: "success",
      });
      
      router.refresh();
    } catch (err) {
      console.error(err);
      notify({
        title: "Error",
        description: "Failed to delete ticket.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-banking-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
      title="Delete Ticket"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
