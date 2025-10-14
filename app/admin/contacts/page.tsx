"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactSubmission } from "@/lib/supabase";
import { Calendar, Mail, MessageSquare, User } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadContacts() {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching contact submissions:", error);
          throw error;
        }

        setContacts(data || []);
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) => filter === "all" || contact.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "responded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "ახალი";
      case "read":
        return "წაკითხული";
      case "responded":
        return "უპასუხეს";
      case "closed":
        return "დახურული";
      default:
        return status;
    }
  };

  const updateContactStatus = async (contactId: number, newStatus: string) => {
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", contactId);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Update local state
      setContacts(
        contacts.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        )
      );
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case "general":
        return "ზოგადი კითხვა";
      case "support":
        return "მომხმარებელთა მხარდაჭერა";
      case "billing":
        return "ფასდაკლების კითხვა";
      case "partnership":
        return "პარტნიორობის შესაძლებლობა";
      case "talent":
        return "ხმოვანი მსახიობის გახდომა";
      default:
        return subject;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold">Contact Submissions</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm md:text-base">
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            შეტყობინებები
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            მომხმარებლების შეტყობინებების მართვა
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48 text-xs md:text-sm">
            <SelectValue placeholder="სტატუსით ფილტრაცია" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              ყველა შეტყობინება ({contacts.length})
            </SelectItem>
            <SelectItem value="new">
              ახალი ({contacts.filter((c) => c.status === "new").length})
            </SelectItem>
            <SelectItem value="read">
              წაკითხული ({contacts.filter((c) => c.status === "read").length})
            </SelectItem>
            <SelectItem value="responded">
              უპასუხეს (
              {contacts.filter((c) => c.status === "responded").length})
            </SelectItem>
            <SelectItem value="closed">
              დახურული ({contacts.filter((c) => c.status === "closed").length})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 md:space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold">
                შეტყობინებები არ არის
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {filter === "all"
                  ? "ჯერ არ შემოსულა შეტყობინებები."
                  : `${getStatusLabel(
                      filter
                    )} სტატუსით შეტყობინებები არ მოიძებნა.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm md:text-base lg:text-lg font-semibold break-words">
                        {getSubjectLabel(contact.subject)}
                      </div>
                    </CardTitle>
                    <div className="flex flex-col gap-2 mt-2 text-xs md:text-sm text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span className="text-xs md:text-sm">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 min-w-0">
                          <User className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span className="truncate text-xs md:text-sm">
                            {contact.name}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline truncate text-xs md:text-sm"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      contact.status
                    )} text-xs whitespace-nowrap self-start`}
                  >
                    {getStatusLabel(contact.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">
                    შეტყობინება
                  </h4>
                  <div className="p-2 md:p-3 bg-muted/50 rounded border-l-4 border-orange-500">
                    <p className="whitespace-pre-wrap text-xs md:text-sm break-words">
                      {contact.message}
                    </p>
                  </div>
                </div>

                {contact.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm md:text-base">
                      ადმინისტრაციის შენიშვნები
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground break-words">
                      {contact.admin_notes}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-3 md:pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs md:text-sm w-full sm:w-auto"
                    onClick={() =>
                      window.open(`mailto:${contact.email}`, "_blank")
                    }
                  >
                    <Mail className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    პასუხი
                  </Button>
                  <Select
                    value={contact.status}
                    onValueChange={(newStatus) =>
                      updateContactStatus(contact.id, newStatus)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-32 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">ახალი</SelectItem>
                      <SelectItem value="read">წაკითხული</SelectItem>
                      <SelectItem value="responded">უპასუხეს</SelectItem>
                      <SelectItem value="closed">დახურული</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
