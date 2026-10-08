"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useMyRoommateProfile, 
  useCreateRoommateProfile, 
  useUpdateRoommateProfile, 
  useBestRoommateMatches 
} from "@/hooks/roommateProfile.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, SearchIcon, SparklesIcon, UserCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RoommatesPage() {
  const { data: myProfileRes, isLoading: isLoadingProfile } = useMyRoommateProfile();
  const myProfile = myProfileRes?.data;
  const hasProfile = !!myProfile;
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-6 rounded-xl border gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="h-8 w-8 text-indigo-500" />
            Roommate Matching
          </h2>
          <p className="text-muted-foreground">Find the perfect roommate based on lifestyle, budget, and habits.</p>
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
                  To find your perfect roommate match, we need to know a bit about your lifestyle and preferences first.
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
  const { data: matchesRes, isLoading } = useBestRoommateMatches();
  const matches = matchesRes?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center justify-center">
          <SearchIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
          <h3 className="text-xl font-semibold">No matches found</h3>
          <p className="text-muted-foreground">Check back later or adjust your preferences to find more matches.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match: any) => (
        <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow border-indigo-100 dark:border-indigo-900/50">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24 relative">
            <div className="absolute -bottom-10 left-6">
              {match.user?.profileImage ? (
                <img src={match.user.profileImage} alt={match.user.name} className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-950 object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-950 bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold">
                  {match.user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <HeartIcon className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="font-bold text-sm">{match.matchScore}% Match</span>
            </div>
          </div>
          
          <CardContent className="pt-14 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl">{match.user?.name}</h3>
                <p className="text-sm text-muted-foreground">{match.user?.email}</p>
              </div>
            </div>

            <p className="text-sm line-clamp-3 mb-6 text-gray-600 dark:text-gray-300">
              {match.bio || "No bio provided."}
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Match Score</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{match.matchScore}/100</span>
                </div>
                <Progress value={match.matchScore} className="h-2 bg-indigo-100 dark:bg-indigo-950">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${match.matchScore}%` }} />
                </Progress>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Budget</span>
                  <span className="font-medium">${match.budgetMin} - ${match.budgetMax}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Cleanliness</span>
                  <span className="font-medium capitalize">{match.cleanlinessLevel?.toLowerCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Smoking</span>
                  <span className="font-medium">{match.smokingAllowed ? "Allowed" : "No"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Pets</span>
                  <span className="font-medium">{match.petsAllowed ? "Allowed" : "No"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RoommateProfileForm({ initialData }: { initialData?: any }) {
  const { mutate: createProfile, isPending: isCreating } = useCreateRoommateProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateRoommateProfile();
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
    sleepTime: initialData?.sleepTime ? new Date(initialData.sleepTime).toISOString().substring(11, 16) : "22:00",
    wakeTime: initialData?.wakeTime ? new Date(initialData.wakeTime).toISOString().substring(11, 16) : "07:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
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
        <CardTitle>{initialData ? "Update Your Profile" : "Create Roommate Profile"}</CardTitle>
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
                <Label htmlFor="budgetMin">Minimum Budget ($/month)</Label>
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
                <Label htmlFor="budgetMax">Maximum Budget ($/month)</Label>
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
              <Select value={formData.genderPreference} onValueChange={(v) => handleSelectChange('genderPreference', v)}>
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
            <h3 className="font-semibold text-lg border-b pb-2">Lifestyle & Habits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Cleanliness Standard</Label>
                  <Select value={formData.cleanlinessLevel} onValueChange={(v) => handleSelectChange('cleanlinessLevel', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Relaxed (Messy sometimes)</SelectItem>
                      <SelectItem value="MEDIUM">Average (Clean common areas)</SelectItem>
                      <SelectItem value="HIGH">Very Clean (Strict about chores)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Noise Tolerance</Label>
                  <Select value={formData.noiseTolerance} onValueChange={(v) => handleSelectChange('noiseTolerance', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Quiet (Library vibes)</SelectItem>
                      <SelectItem value="MEDIUM">Moderate (Music/TV ok during day)</SelectItem>
                      <SelectItem value="HIGH">High (Party/Loud noises ok)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Smoking Allowed</Label>
                    <p className="text-sm text-muted-foreground">Are you okay with smoking in the apartment?</p>
                  </div>
                  <Switch 
                    checked={formData.smokingAllowed} 
                    onCheckedChange={(c) => handleSwitchChange('smokingAllowed', c)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pets Allowed</Label>
                    <p className="text-sm text-muted-foreground">Are you okay with pets in the apartment?</p>
                  </div>
                  <Switch 
                    checked={formData.petsAllowed} 
                    onCheckedChange={(c) => handleSwitchChange('petsAllowed', c)}
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

          <Button type="submit" className="w-full md:w-auto" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
