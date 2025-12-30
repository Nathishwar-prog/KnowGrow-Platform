import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "../../../@/components/ui/dialog";
import { Button } from "../../../@/components/ui/button";
import { Coffee, Brain } from "lucide-react";

export function FocusAlert({ isOpen, onClose, onTakeBreak, type = "suggestion" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
            {type === "warning" ? (
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Coffee className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {type === "warning" ? "Deep Focus Warning" : "Time for a Brain Break"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            {type === "warning" 
              ? "You've been focused for over 50 minutes. Continuous learning without rest reduces long-term retention."
              : "You've reached the 25-minute mark. A short 5-minute break helps maintain peak mental performance."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-border/50"
          >
            Continue Anyway
          </Button>
          <Button 
            onClick={onTakeBreak}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
          >
            Take Break
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
