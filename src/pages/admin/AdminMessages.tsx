import { Mail, Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Inquiry = {
  id: string;
  type: "contact" | "catalog";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message?: string;
  status?: string;
  created_at: string;
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setMessages((data || []) as Inquiry[]);
      }
      setLoading(false);
    }

    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Manage customer inquiries and catalog requests</p>
      </div>

      {loading ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <Loader2 size={40} className="mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground font-medium">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <Mail size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-foreground font-semibold mb-1">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            Messages from contact and catalog forms will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, idx) => (
                  <tr key={msg.id} className={`border-t border-border hover:bg-muted/50 transition-colors ${idx % 2 === 0 ? "bg-background/50" : ""}`}>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        msg.type === "catalog" 
                          ? "bg-blue-100/80 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300" 
                          : "bg-green-100/80 text-green-800 dark:bg-green-950/50 dark:text-green-300"
                      }`}>
                        {msg.type === "catalog" ? "🛍️ Catalog" : "💬 Contact"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{msg.first_name} {msg.last_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-foreground">{msg.phone}</div>
                      <div className="text-muted-foreground text-xs">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate" title={msg.message || "-"}>
                      {msg.message || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{msg.first_name} {msg.last_name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    msg.type === "catalog" 
                      ? "bg-blue-100/80 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300" 
                      : "bg-green-100/80 text-green-800 dark:bg-green-950/50 dark:text-green-300"
                  }`}>
                    {msg.type === "catalog" ? "🛍️" : "💬"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Contact Info</p>
                    <p className="text-foreground">{msg.phone}</p>
                    <p className="text-muted-foreground text-xs break-all">{msg.email}</p>
                  </div>

                  {msg.message && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Message</p>
                      <p className="text-foreground line-clamp-3">{msg.message}</p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && messages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {messages.length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Total Messages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {messages.filter(m => m.type === "contact").length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Contact Inquiries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {messages.filter(m => m.type === "catalog").length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Catalog Requests</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
