import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Wallet, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration
const currentCutoff = {
  salary: 35000,
  allocations: {
    dailyNeeds: { planned: 14000, actual: 12500, percentage: 40 },
    school: { planned: 7000, actual: 7000, percentage: 20 },
    parents: { planned: 3500, actual: 3500, percentage: 10 },
    girlfriend: { planned: 3500, actual: 2800, percentage: 10 },
    savings: { planned: 3500, actual: 3500, percentage: 10 },
    goals: { planned: 2100, actual: 2100, percentage: 6 },
    personal: { planned: 1400, actual: 800, percentage: 4 }
  }
};

const goals = [
  { id: 1, name: "Renovation + Aircon", target: 70000, current: 15400, priority: 1 },
  { id: 2, name: "High-End PC", target: 45000, current: 8200, priority: 2 }
];

export function Dashboard() {
  const totalActual = Object.values(currentCutoff.allocations).reduce((sum, cat) => sum + cat.actual, 0);
  const totalPlanned = Object.values(currentCutoff.allocations).reduce((sum, cat) => sum + cat.planned, 0);
  const remainingBalance = currentCutoff.salary - totalActual;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Finance Dashboard</h1>
              <p className="text-muted-foreground mt-1">Cutoff Period: January 1-15, 2024</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Salary</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{currentCutoff.salary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This cutoff period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{totalActual.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((totalActual / totalPlanned) * 100).toFixed(1)}% of planned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₱{remainingBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {(((currentCutoff.allocations.savings.actual + currentCutoff.allocations.goals.actual) / currentCutoff.salary) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Savings + Goals</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Allocation Breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Allocations</CardTitle>
                <p className="text-sm text-muted-foreground">Planned vs Actual spending</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(currentCutoff.allocations).map(([key, allocation]) => {
                    const progressPercentage = (allocation.actual / allocation.planned) * 100;
                    const categoryName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{categoryName}</span>
                            <span className="text-xs text-muted-foreground">
                              {allocation.percentage}%
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ₱{allocation.actual.toLocaleString()} / ₱{allocation.planned.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="progress-finance">
                          <div 
                            className="progress-finance-fill"
                            style={{ 
                              width: `${Math.min(progressPercentage, 100)}%`,
                              backgroundColor: progressPercentage > 100 ? 'hsl(var(--destructive))' : 'hsl(var(--progress-indicator))'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progressPercentage.toFixed(1)}% used</span>
                          <span>₱{(allocation.planned - allocation.actual).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Tracker */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <p className="text-sm text-muted-foreground">Progress toward targets</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => {
                    const progressPercentage = (goal.current / goal.target) * 100;
                    
                    return (
                      <div key={goal.id} className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{goal.name}</h4>
                            <p className="text-xs text-muted-foreground">Priority #{goal.priority}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ₱{goal.current.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of ₱{goal.target.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="progress-finance">
                          <div 
                            className="progress-finance-fill"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progressPercentage.toFixed(1)}% complete</span>
                          <span>₱{(goal.target - goal.current).toLocaleString()} to go</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Target className="h-4 w-4" />
                  Update Goal
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wallet className="h-4 w-4" />
                  New Cutoff
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}