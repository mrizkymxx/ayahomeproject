import { Mail, Loader2 } from "lucide-react";
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
    <div>
      <h2 className="font-serif text-2xl mb-6">Messages</h2>

      {loading ? (
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <Loader2 size={32} className="mx-auto text-muted-foreground mb-3 animate-spin" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <Mail size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Messages from contact and catalog forms will appear here.</p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Type</th>
                <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Message</th>
                <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-t border-border align-top">
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      msg.type === "catalog" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}>
                      {msg.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{msg.first_name} {msg.last_name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div>{msg.phone}</div>
                    <div>{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[340px]">
                    {msg.message || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
