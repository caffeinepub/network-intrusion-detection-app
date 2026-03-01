import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-cyber-navy-light border-cyber-border max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Shield size={20} className="text-cyber-green" />
            </div>
            <div>
              <DialogTitle className="font-heading text-xl tracking-wider text-foreground">
                OPERATOR SETUP
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-mono text-xs">
                First-time configuration required
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-xs text-muted-foreground tracking-wider">
              OPERATOR NAME
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-cyber-navy-mid border-cyber-border font-mono text-foreground placeholder:text-muted-foreground/50 focus:border-cyber-green/50 focus:ring-cyber-green/20"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/40 font-heading tracking-widest"
          >
            {saveProfile.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-cyber-green/50 border-t-cyber-green rounded-full animate-spin" />
                INITIALIZING...
              </span>
            ) : (
              'INITIALIZE SYSTEM'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
