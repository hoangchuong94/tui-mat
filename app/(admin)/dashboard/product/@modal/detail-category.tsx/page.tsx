'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Gender } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { CreateCategory } from '@/schema/product';
import { InputField } from '@/components/custom-field';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export default function DetailCategoryModal() {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [genders, setGenders] = useState<Gender[]>([]);

    const form = useForm<z.infer<typeof CreateCategory>>({
        resolver: zodResolver(CreateCategory),
        defaultValues: {
            name: '',
            genderId: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof CreateCategory>) => {
        if (!values.name || !values.genderId) return;

        setLoading(true);
        setSuccess(false);
        setErrorMessage('');

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    genderId: values.genderId,
                }),
            });

            if (res.ok) {
                await res.json();
                router.refresh();
                form.reset();
                setSuccess(true);
            } else {
                const error = await res.json();
                setErrorMessage(error.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setErrorMessage('An error occurred, please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchGenders = async () => {
            try {
                const res = await fetch('/api/genders');
                const data = await res.json();
                setGenders(data);
            } catch (error) {
                console.error('An error fetch genders:', error);
            }
        };

        fetchGenders();
    }, []);

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
                    <DialogTitle className="text-center font-thin">Add New Category</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="genderId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender : </FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="bg-slate-200">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a item" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {genders.map((item) => (
                                                <SelectItem className="uppercase" value={item.id} key={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <InputField
                            name="name"
                            label="Name Category :"
                            className="bg-slate-200 focus:bg-white"
                            placeholder="Please enter your name category"
                        />
                        <FormSuccess message={success ? 'Performed successfully' : ''} />
                        <FormError message={errorMessage} />

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
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
