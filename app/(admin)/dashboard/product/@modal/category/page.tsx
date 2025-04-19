'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddCategoryModal() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!name) return;

        setLoading(true);

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                router.back();
            } else {
                alert('An error occurred. Please try again!');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('An error occurred. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) router.back();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading || !name}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
