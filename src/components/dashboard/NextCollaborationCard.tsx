import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CollaborationCards } from "./CollaborationCards";
export function NextCollaborationCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Next Collaboration</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-8">
        <CollaborationCards />
        <CollaborationCards />
        <CollaborationCards />
        <CollaborationCards />
      </CardContent>
    </Card>
  );
}
