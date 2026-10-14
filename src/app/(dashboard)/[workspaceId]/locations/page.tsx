"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MapPin, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Star,
  Plus,
  Phone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { BusinessLocation } from "@/types";

export default function LocationsPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      if (!workspaceId) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("business_locations")
          .select("*")
          .eq("workspace_id", workspaceId)
          .order("location_name", { ascending: true });

        if (!error && data) {
          setLocations(data as BusinessLocation[]);
        }
      } catch (err) {
        console.error("Load locations error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLocations();
  }, [workspaceId]);

  const handleSyncLocation = (locId: string) => {
    setIsSyncing(locId);
    setTimeout(() => {
      setIsSyncing(null);
    }, 1000);
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.store_code && loc.store_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loc.city && loc.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Authorized Locations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified Google Business locations, store codes, and sync health.
          </p>
        </div>

        <Link href={`/${workspaceId}/settings#google-integration`}>
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="w-4 h-4" /> Connect More Locations
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center text-xs text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading authorized locations...
        </div>
      ) : locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No Business Locations Connected Yet"
          description="Connect your verified Google Business Profile to auto-import all your branches, addresses, store codes, and customer reviews."
          actionLabel="Connect Google Account"
          actionHref={`/${workspaceId}/settings#google-integration`}
        />
      ) : (
        <>
          {/* SEARCH AND FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by branch name, store code, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500">
              <span>Total: <strong>{filteredLocations.length} locations</strong></span>
            </div>
          </div>

          {/* LOCATIONS LIST */}
          <div className="space-y-4">
            {filteredLocations.map((loc) => (
              <Card key={loc.id} className="hover:border-slate-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Branch Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{loc.location_name}</h3>
                        {loc.store_code && (
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {loc.store_code}
                          </span>
                        )}
                        {loc.is_verified && (
                          <Badge variant="success" className="text-[10px] gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified by Google
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {loc.address_line1}, {loc.city}, {loc.state} {loc.postal_code}
                      </p>

                      {loc.phone_number && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {loc.phone_number}
                        </p>
                      )}
                    </div>

                    {/* Rating & Review Counts */}
                    <div className="flex items-center gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-900">
                          <span>{loc.average_rating || 0.0}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{loc.total_review_count || 0} reviews</p>
                      </div>

                      {/* Sync Status & Action */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncLocation(loc.id)}
                          isLoading={isSyncing === loc.id}
                          className="text-xs h-8"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Sync
                        </Button>

                        <Link href={`/${workspaceId}/reviews?location=${loc.id}`}>
                          <Button size="sm" variant="secondary" className="text-xs h-8">
                            View Reviews
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
