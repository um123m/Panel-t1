import { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Button, Input, Card } from "./common";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fieldLabel?: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export function ActionModal({ isOpen, onClose, title, fieldLabel, onSubmit, placeholder }: ActionModalProps) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-6 bg-panel border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {fieldLabel && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{fieldLabel}</label>
            <Input 
              autoFocus
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder={placeholder} 
            />
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button 
            onClick={() => {
              onSubmit(value);
              setValue("");
              onClose();
            }}
          >
            تأكيد
          </Button>
        </div>
      </Card>
    </div>
  );
}
