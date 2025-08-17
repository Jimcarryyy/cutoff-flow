import { useState } from 'react';

export interface Allocation {
  planned: number;
  actual: number;
  percentage: number;
}

export interface CutoffData {
  salary: number;
  allocations: {
    dailyNeeds: Allocation;
    school: Allocation;
    parents: Allocation;
    girlfriend: Allocation;
    savings: Allocation;
    goals: Allocation;
    personal: Allocation;
  };
}

export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  priority: number;
}

export interface Expense {
  id: number;
  category: keyof CutoffData['allocations'];
  amount: number;
  description: string;
  date: string;
}

export function useFinanceData() {
  const [currentCutoff, setCurrentCutoff] = useState<CutoffData>({
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
  });

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, name: "Renovation + Aircon", target: 70000, current: 15400, priority: 1 },
    { id: 2, name: "High-End PC", target: 45000, current: 8200, priority: 2 }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (category: keyof CutoffData['allocations'], amount: number, description: string) => {
    const newExpense: Expense = {
      id: Date.now(),
      category,
      amount,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [...prev, newExpense]);
    
    // Update actual allocation
    setCurrentCutoff(prev => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [category]: {
          ...prev.allocations[category],
          actual: prev.allocations[category].actual + amount
        }
      }
    }));
  };

  const updateGoal = (goalId: number, contribution: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: goal.current + contribution }
        : goal
    ));
  };

  const startNewCutoff = (newSalary: number) => {
    const newAllocations = Object.fromEntries(
      Object.entries(currentCutoff.allocations).map(([key, allocation]) => [
        key,
        {
          ...allocation,
          planned: Math.round((newSalary * allocation.percentage) / 100),
          actual: 0
        }
      ])
    ) as CutoffData['allocations'];

    setCurrentCutoff({
      salary: newSalary,
      allocations: newAllocations
    });

    // Clear expenses for new cutoff
    setExpenses([]);
  };

  const updateAllocationPercentages = (newPercentages: Record<string, number>) => {
    const newAllocations = Object.fromEntries(
      Object.entries(currentCutoff.allocations).map(([key, allocation]) => [
        key,
        {
          ...allocation,
          percentage: newPercentages[key] || allocation.percentage,
          planned: Math.round((currentCutoff.salary * (newPercentages[key] || allocation.percentage)) / 100)
        }
      ])
    ) as CutoffData['allocations'];

    setCurrentCutoff(prev => ({
      ...prev,
      allocations: newAllocations
    }));
  };

  return {
    currentCutoff,
    goals,
    expenses,
    addExpense,
    updateGoal,
    startNewCutoff,
    updateAllocationPercentages
  };
}