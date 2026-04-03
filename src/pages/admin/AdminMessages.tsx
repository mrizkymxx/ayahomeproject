import { Mail } from "lucide-react";

const AdminMessages = () => {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Messages</h2>
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <Mail size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No messages yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Messages from the contact form will appear here.</p>
      </div>
    </div>
  );
};

export default AdminMessages;
