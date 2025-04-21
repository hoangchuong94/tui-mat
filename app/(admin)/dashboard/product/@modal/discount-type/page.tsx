'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DiscountType() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    console.log(success);

    const handleSubmit = async () => {
        if (!name) return;

        setLoading(true);
        setSuccess(false);
        setErrorMessage('');

        try {
            const res = await fetch('/api/genders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                await res.json();
                router.refresh();
                setName('');
                setSuccess(true);
            } else {
                const error = await res.json();
                setErrorMessage(error.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error adding gender:', error);
            setErrorMessage('An error occurred, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                setErrorMessage('');
                setSuccess(false);
                if (!value) router.back();
                if (success) {
                    router.push('/dashboard/product/new');
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Gender</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Gender name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setSuccess(false);
                        setErrorMessage('');
                    }}
                />

                {success && <p className="mt-2 text-sm text-green-600">Successfully added!</p>}
                {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                            router.back();
                            if (success) {
                                router.push('/dashboard/product/new');
                            }
                        }}
                    >
                        Close
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading || !name}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
