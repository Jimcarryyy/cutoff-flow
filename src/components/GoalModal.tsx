import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Goal } from "@/hooks/useFinanceData";

interface GoalModalProps {
  goals: Goal[];
  onUpdateGoal: (goalId: number, contribution: number) => void;
  trigger?: React.ReactNode;
}

export function GoalModal({ goals, onUpdateGoal, trigger }: GoalModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number>(goals[0]?.id || 1);
  const [contribution, setContribution] = useState('');
  const { toast } = useToast();

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contributionAmount = parseFloat(contribution);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    onUpdateGoal(selectedGoalId, contributionAmount);
    
    toast({
      title: "Goal Updated",
      description: `₱${contributionAmount.toLocaleString()} contributed to ${selectedGoal?.name}`,
    });

    // Reset form
    setContribution('');
    setOpen(false);
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start gap-2">
            <Target className="h-4 w-4" />
            Update Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contribute to Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goal">Select Goal</Label>
            <Select value={selectedGoalId.toString()} onValueChange={(value) => setSelectedGoalId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id.toString()}>
                    {goal.name} (₱{goal.current.toLocaleString()} / ₱{goal.target.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedGoal && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress:</span>
                <span>₱{selectedGoal.current.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target:</span>
                <span>₱{selectedGoal.target.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Remaining:</span>
                <span>₱{(selectedGoal.target - selectedGoal.current).toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="contribution">Contribution Amount (₱)</Label>
            <Input
              id="contribution"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Contribution</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}