// components/game/Modal.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog" // Import form Shadcn
import { Button } from "@/components/ui/button"


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {children}
                </div>

            </DialogContent>
        </Dialog>
    );
};
export default Modal;