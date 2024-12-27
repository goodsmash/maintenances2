import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Gift,
  Star,
  Trophy,
  Clock,
  Calendar,
  DollarSign,
  Award,
  Zap,
  Send,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { api } from '@/lib/api';

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  pointsToNextTier: number;
  totalSpent: number;
  servicesUsed: number;
  lastService: string;
  preferences: {
    serviceTypes: string[];
    communicationPreferences: string[];
    specialRequests: string[];
  };
  rewards: {
    id: string;
    name: string;
    type: string;
    value: number;
    expiryDate: string;
    status: 'available' | 'used' | 'expired';
  }[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'service' | 'gift' | 'points';
  value: number;
  pointsCost: number;
  tier: 'all' | 'silver' | 'gold' | 'platinum';
  validityDays: number;
  termsConditions: string[];
  redemptions: number;
  maxRedemptions?: number;
  startDate?: string;
  endDate?: string;
}

interface LoyaltyMetrics {
  totalMembers: number;
  activeMembers: number;
  totalPoints: number;
  averageEngagement: number;
  membershipTiers: {
    tier: string;
    count: number;
  }[];
  rewardRedemptions: {
    month: string;
    redemptions: number;
  }[];
  customerRetention: number;
  averagePointsPerMember: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function LoyaltyProgram() {
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [metrics, setMetrics] = useState<LoyaltyMetrics | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, rewardsData, metricsData] = await Promise.all([
        api.getLoyaltyMembers(),
        api.getLoyaltyRewards(),
        api.getLoyaltyMetrics(),
      ]);
      setMembers(membersData);
      setRewards(rewardsData);
      setMetrics(metricsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load loyalty program data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (memberId: string, rewardId: string) => {
    try {
      await api.redeemReward(memberId, rewardId);
      loadData();
      toast({
        title: 'Success',
        description: 'Reward redeemed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to redeem reward',
        variant: 'destructive',
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'text-orange-600';
      case 'silver':
        return 'text-gray-400';
      case 'gold':
        return 'text-yellow-400';
      case 'platinum':
        return 'text-blue-400';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loyalty Program</h2>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          Create New Reward
        </Button>
      </div>

      {/* Program Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalMembers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeMembers.toLocaleString()} active members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.averagePointsPerMember.toLocaleString()} avg per
                member
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Engagement Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.averageEngagement * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of active members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Retention Rate
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.customerRetention * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Customer retention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Membership Tiers and Rewards */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Membership Tiers</CardTitle>
            <CardDescription>
              Distribution of members across tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics && (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.membershipTiers}
                      dataKey="count"
                      nameKey="tier"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {metrics.membershipTiers.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
            <CardDescription>
              Current rewards and redemption options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{reward.name}</h4>
                    <p className="text-sm text-gray-500">
                      {reward.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge>{reward.type}</Badge>
                      <Badge variant="outline">
                        {reward.pointsCost} points
                      </Badge>
                      {reward.tier !== 'all' && (
                        <Badge
                          className={getTierColor(reward.tier)}
                        >
                          {reward.tier}+
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {reward.type === 'discount'
                        ? `${reward.value}% off`
                        : reward.type === 'points'
                        ? `${reward.value} bonus points`
                        : `$${reward.value} value`}
                    </div>
                    {reward.maxRedemptions && (
                      <div className="text-sm text-gray-500">
                        {reward.redemptions}/{reward.maxRedemptions}{' '}
                        redeemed
                      </div>
                    )}
                    {reward.endDate && (
                      <div className="text-sm text-gray-500">
                        Expires {format(new Date(reward.endDate), 'PP')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member List and Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Loyalty program members and their status
              </CardDescription>
            </div>
            <Input
              placeholder="Search members..."
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(member.tier)}>
                      {member.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {member.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.pointsToNextTier.toLocaleString()} to next
                        tier
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${member.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(member.lastService), 'PP')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedMember(member.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Details Dialog */}
      {selectedMember && (
        <Dialog
          open={!!selectedMember}
          onOpenChange={() => setSelectedMember('')}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                View and manage member information
              </DialogDescription>
            </DialogHeader>
            {members
              .filter((m) => m.id === selectedMember)
              .map((member) => (
                <div key={member.id} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Member Information</h4>
                      <dl className="mt-2 space-y-2">
                        <div>
                          <dt className="text-sm text-gray-500">Name</dt>
                          <dd>{member.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Email</dt>
                          <dd>{member.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Phone</dt>
                          <dd>{member.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">
                            Member Since
                          </dt>
                          <dd>{format(new Date(member.joinDate), 'PP')}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-medium">Loyalty Status</h4>
                      <dl className="mt-2 space-y-2">
                        <div>
                          <dt className="text-sm text-gray-500">Tier</dt>
                          <dd>
                            <Badge className={getTierColor(member.tier)}>
                              {member.tier}
                            </Badge>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Points</dt>
                          <dd>{member.points.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">
                            Total Spent
                          </dt>
                          <dd>${member.totalSpent.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">
                            Services Used
                          </dt>
                          <dd>{member.servicesUsed}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Member Preferences</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium">
                          Preferred Services
                        </h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.preferences.serviceTypes.map(
                            (service) => (
                              <Badge
                                key={service}
                                variant="secondary"
                              >
                                {service}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">
                          Communication Preferences
                        </h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.preferences.communicationPreferences.map(
                            (pref) => (
                              <Badge
                                key={pref}
                                variant="secondary"
                              >
                                {pref}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Available Rewards</h4>
                    <div className="space-y-4">
                      {member.rewards
                        .filter(
                          (reward) => reward.status === 'available'
                        )
                        .map((reward) => (
                          <div
                            key={reward.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium">
                                {reward.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {reward.type} - ${reward.value} value
                              </p>
                              <p className="text-sm text-gray-500">
                                Expires{' '}
                                {format(
                                  new Date(reward.expiryDate),
                                  'PP'
                                )}
                              </p>
                            </div>
                            <Button
                              onClick={() =>
                                redeemReward(member.id, reward.id)
                              }
                            >
                              Redeem
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </DialogContent>
        </Dialog>
      )}

      {/* Redemption History */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Reward Redemptions</CardTitle>
            <CardDescription>
              Monthly reward redemption trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.rewardRedemptions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="redemptions"
                    fill="#8884d8"
                    name="Redemptions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
