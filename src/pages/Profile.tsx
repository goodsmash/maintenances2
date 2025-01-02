import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/services/analytics";

export default function Profile() {
  const { user, logout } = useAuth0();

  const handleLogout = () => {
    trackEvent('user_logout');
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.picture} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
