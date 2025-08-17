import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewCutoffModalProps {
  onStartNewCutoff: (newSalary: number) => void;
  trigger?: React.ReactNode;
}

export function NewCutoffModal({ onStartNewCutoff, trigger }: NewCutoffModalProps) {
  const [open, setOpen] = useState(false);
  const [salary, setSalary] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const salaryAmount = parseFloat(salary);
    if (isNaN(salaryAmount) || salaryAmount <= 0) {
      toast({
        title: "Invalid Salary",
        description: "Please enter a valid salary amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    onStartNewCutoff(salaryAmount);
    
    toast({
      title: "New Cutoff Started",
      description: `New cutoff period started with salary of ₱${salaryAmount.toLocaleString()}`,
    });

    // Reset form
    setSalary('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start gap-2">
            <Wallet className="h-4 w-4" />
            New Cutoff
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Cutoff Period</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Starting a new cutoff will:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Reset all actual spending to ₱0</li>
              <li>• Recalculate planned allocations based on new salary</li>
              <li>• Clear expense history for this period</li>
              <li>• Keep your goals and progress intact</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">New Salary Amount (₱)</Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              min="0"
              placeholder="35000.00"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Start New Cutoff</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}