"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMyRoommateProfile,
  useCreateRoommateProfile,
  useUpdateRoommateProfile,
  useBestRoommateMatches,
  useRoommateProfileById,
} from "@/hooks/roommateProfile.hook";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BadgeCheckIcon,
  CigaretteIcon,
  DogIcon,
  HeartIcon,
  MoonIcon,
  ShieldCheckIcon,
  SearchIcon,
  SparklesIcon,
  UserCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RoommatesPage() {
  const { data: myProfileRes, isLoading: isLoadingProfile } =
    useMyRoommateProfile();
  const myProfile = myProfileRes?.data;
  const hasProfile = !!myProfile;
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-6 rounded-xl border gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="h-8 w-8 text-indigo-500" />
            Roommate Matching
          </h2>
          <p className="text-muted-foreground">
            Find the perfect roommate based on lifestyle, budget, and habits.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="matches">Top Matches</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-6">
          {!hasProfile && !isLoadingProfile ? (
            <Card>
              <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                <UserCircle2Icon className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-2xl font-semibold">Profile Required</h3>
                <p className="text-muted-foreground max-w-md mt-2 mb-6">
                  To find your perfect roommate match, we need to know a bit
                  about your lifestyle and preferences first.
                </p>
                <Button onClick={() => setActiveTab("profile")}>
                  Create My Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <RoommateMatchesTab />
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <RoommateProfileForm initialData={myProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoommateMatchesTab() {
  const [city, setCity] = useState("");
  const [building, setBuilding] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{
    city?: string;
    building?: string;
  }>({});
  const [selectedId, setSelectedId] = useState<string>();
  const { data: matchesRes, isLoading, isFetching } =
    useBestRoommateMatches(appliedFilters);
  const { data: profileRes, isLoading: isLoadingProfile } =
    useRoommateProfileById(selectedId);
  const matches = matchesRes?.data || [];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedFilters({
        city: city.trim() || undefined,
        building: building.trim() || undefined,
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [city, building]);

  return (
    <>
      <Card className="mb-6 border-primary/15 bg-card/80">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="roommate-city">Search by city</Label>
            <Input
              id="roommate-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g. Dhaka"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roommate-building">Search by building</Label>
            <Input
              id="roommate-building"
              value={building}
              onChange={(event) => setBuilding(event.target.value)}
              placeholder="Building name"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setCity("");
              setBuilding("");
            }}
            disabled={!city && !building}
          >
            Clear filters
          </Button>
        </CardContent>
      </Card>
      {isFetching && (
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Updating matches...
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold">No matches found</h3>
            <p className="text-muted-foreground">
              Try another city or building name to find more matches.
            </p>
          </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((match: any) => (
        <Card
          key={match.id}
          className="group relative overflow-hidden border-primary/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
          onClick={() => setSelectedId(match.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setSelectedId(match.id);
            }
          }}
        >
          <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 h-20 w-40 rounded-full bg-black/10 blur-2xl" />
            <div className="absolute left-5 top-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              <SparklesIcon className="h-3.5 w-3.5" />
              Suggested for you
            </div>
            <div className="absolute -bottom-11 left-6">
              {match.user?.profileImage ? (
                <img
                  src={match.user.profileImage}
                  alt={match.user.name}
                  className="h-20 w-20 rounded-2xl border-4 border-card object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-xl dark:bg-emerald-950 dark:text-emerald-300">
                  {match.user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-white shadow-lg backdrop-blur-md">
              <HeartIcon className="h-4 w-4 fill-rose-300 text-rose-300" />
              <span className="text-sm font-bold">
                {match.matchScore}% match
              </span>
            </div>
          </div>

          <CardContent className="p-6 pt-14">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-heading text-xl font-bold">
                    {match.user?.name}
                  </h3>
                  <BadgeCheckIcon className="h-5 w-5 shrink-0 text-primary" />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {match.user?.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Great fit
              </span>
            </div>

            <p className="mb-6 line-clamp-3 min-h-[60px] text-sm leading-6 text-muted-foreground">
              {match.bio || "No bio provided."}
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl bg-muted/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Compatibility
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Lifestyle alignment
                    </p>
                  </div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[conic-gradient(var(--primary)_0deg,var(--primary)_calc(var(--score)*3.6deg),color-mix(in_oklch,var(--muted)_80%,transparent)_0deg)]"
                    style={
                      { "--score": match.matchScore } as React.CSSProperties
                    }
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm font-bold text-primary">
                      {match.matchScore}%
                    </div>
                  </div>
                </div>
                <Progress
                  value={match.matchScore}
                  className="h-1.5 bg-primary/10"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"
                    style={{ width: `${match.matchScore}%` }}
                  />
                </Progress>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5">
                  <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Budget
                    </p>
                    <p className="truncate text-xs font-semibold">
                      ৳{match.budgetMin}–৳{match.budgetMax}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5">
                  <span className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-500">
                    <SparklesIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cleanliness
                    </p>
                    <p className="text-xs font-semibold capitalize">
                      {match.cleanlinessLevel?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5">
                  <span className="rounded-lg bg-amber-500/10 p-1.5 text-amber-500">
                    <CigaretteIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Smoking
                    </p>
                    <p className="text-xs font-semibold">
                      {match.smokingAllowed ? "Allowed" : "No"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5">
                  <span className="rounded-lg bg-sky-500/10 p-1.5 text-sky-500">
                    <DogIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Pets
                    </p>
                    <p className="text-xs font-semibold">
                      {match.petsAllowed ? "Allowed" : "No"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <MoonIcon className="h-3.5 w-3.5 text-primary" />
                <span>
                  {match.user?.bookings?.[0]?.room?.flat?.building
                    ? `${match.user.bookings[0].room.flat.building.name} · ${match.user.bookings[0].room.flat.building.city}`
                    : "Residence not listed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
      )}
      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {profileRes?.data?.user?.name || "Roommate profile"}
            </DialogTitle>
            <DialogDescription>
              Review lifestyle preferences and current residence details.
            </DialogDescription>
          </DialogHeader>
          {isLoadingProfile ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {profileRes?.data?.bio || "No bio added yet."}
              </p>
              {profileRes?.data?.user?.bookings?.[0]?.room ? (
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Current residence
                  </p>
                  <p className="mt-2 font-semibold">
                    {profileRes.data.user.bookings[0].room.flat.building.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profileRes.data.user.bookings[0].room.flat.building.city} · Flat{" "}
                    {profileRes.data.user.bookings[0].room.flat.flatNumber} · Room{" "}
                    {profileRes.data.user.bookings[0].room.name}
                  </p>
                </div>
              ) : (
                <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                  This roommate has not listed an active residence.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function RoommateProfileForm({ initialData }: { initialData?: any }) {
  const { mutate: createProfile, isPending: isCreating } =
    useCreateRoommateProfile();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateRoommateProfile();
  const isPending = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    bio: initialData?.bio || "",
    budgetMin: initialData?.budgetMin || 500,
    budgetMax: initialData?.budgetMax || 1500,
    genderPreference: initialData?.genderPreference || "ANY",
    smokingAllowed: initialData?.smokingAllowed || false,
    petsAllowed: initialData?.petsAllowed || false,
    cleanlinessLevel: initialData?.cleanlinessLevel || "MEDIUM",
    noiseTolerance: initialData?.noiseTolerance || "MEDIUM",
    sleepTime: initialData?.sleepTime
      ? new Date(initialData.sleepTime).toISOString().substring(11, 16)
      : "22:00",
    wakeTime: initialData?.wakeTime
      ? new Date(initialData.wakeTime).toISOString().substring(11, 16)
      : "07:00",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      sleepTime: formData.sleepTime,
      wakeTime: formData.wakeTime,
    };

    if (initialData) {
      updateProfile(payload);
    } else {
      createProfile(payload);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Update Your Profile" : "Create Roommate Profile"}
        </CardTitle>
        <CardDescription>
          Tell us about yourself so we can find the perfect roommate for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">About You</h3>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell potential roommates about yourself, your hobbies, and what you're looking for..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum Budget (৳/month)</Label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum Budget (৳/month)</Label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Roommate Gender</Label>
              <Select
                value={formData.genderPreference}
                onValueChange={(v) => handleSelectChange("genderPreference", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Gender</SelectItem>
                  <SelectItem value="MALE">Male Only</SelectItem>
                  <SelectItem value="FEMALE">Female Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Lifestyle & Habits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Cleanliness Standard</Label>
                  <Select
                    value={formData.cleanlinessLevel}
                    onValueChange={(v) =>
                      handleSelectChange("cleanlinessLevel", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">
                        Relaxed (Messy sometimes)
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        Average (Clean common areas)
                      </SelectItem>
                      <SelectItem value="HIGH">
                        Very Clean (Strict about chores)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Noise Tolerance</Label>
                  <Select
                    value={formData.noiseTolerance}
                    onValueChange={(v) =>
                      handleSelectChange("noiseTolerance", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Quiet (Library vibes)</SelectItem>
                      <SelectItem value="MEDIUM">
                        Moderate (Music/TV ok during day)
                      </SelectItem>
                      <SelectItem value="HIGH">
                        High (Party/Loud noises ok)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Smoking Allowed</Label>
                    <p className="text-sm text-muted-foreground">
                      Are you okay with smoking in the apartment?
                    </p>
                  </div>
                  <Switch
                    checked={formData.smokingAllowed}
                    onCheckedChange={(c) =>
                      handleSwitchChange("smokingAllowed", c)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pets Allowed</Label>
                    <p className="text-sm text-muted-foreground">
                      Are you okay with pets in the apartment?
                    </p>
                  </div>
                  <Switch
                    checked={formData.petsAllowed}
                    onCheckedChange={(c) =>
                      handleSwitchChange("petsAllowed", c)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="sleepTime">Typical Sleep Time</Label>
                <Input
                  id="sleepTime"
                  name="sleepTime"
                  type="time"
                  value={formData.sleepTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wakeTime">Typical Wake Time</Label>
                <Input
                  id="wakeTime"
                  name="wakeTime"
                  type="time"
                  value={formData.wakeTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isPending}
          >
            {isPending
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
