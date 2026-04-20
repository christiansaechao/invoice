import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FromDetailsSection } from "@/components/settings/FromDetailsSection";
import { DefaultClientSection } from "@/components/settings/DefaultClientSection";
import { BrandAssetsSection } from "@/components/settings/BrandAssetsSection";
import { MySubscriptionSection } from "@/components/settings/MySubscriptionSection";
import { ClientBillingSection } from "@/components/settings/ClientBillingSection";
import { PaymentLinkSection } from "@/components/settings/PaymentLinkSection";
import { UserProfileSection } from "@/components/settings/UserProfileSection";
import { useCurrentSubscription } from "@/api/subscription.api";
import { User, CreditCard, Image, Zap } from "lucide-react";

export function Settings() {
  const { data: subscription } = useCurrentSubscription();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, brand assets, and subscription.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            My Subscription
          </TabsTrigger>
          <TabsTrigger
            value="client-billing"
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Client Billing
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Brand
          </TabsTrigger>
        </TabsList>

        {/* ── Profile tab ─────────────────────────────── */}
        <TabsContent value="profile">
          <div className="max-w-lg">
            <UserProfileSection />
          </div>
        </TabsContent>

        {/* ── Subscription tab ──────────────────────────── */}
        <TabsContent value="subscription">
          <div className="max-w-lg">
            <MySubscriptionSection subscription={subscription} />
          </div>
        </TabsContent>

        {/* ── Client Billing tab ────────────────────────── */}
        <TabsContent value="client-billing">
          <div className="flex flex-col gap-8">
            <div className="max-w-lg">
              <ClientBillingSection />
            </div>
            <div className="max-w-lg">
              <PaymentLinkSection />
            </div>
          </div>
        </TabsContent>

        {/* ── Brand tab ───────────────────────────────── */}
        <TabsContent value="brand">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
              <DefaultClientSection />
              <BrandAssetsSection />
            </div>
            <div>
              <FromDetailsSection />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
