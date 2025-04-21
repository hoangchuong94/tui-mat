'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';

import Modal from '@/components/modal';
import { CreateGender } from '@/schema/product';
import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { Form } from '@/components/ui/form';

export default function GenderModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const idGender = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm<z.infer<typeof CreateGender>>({
        resolver: zodResolver(CreateGender),
        defaultValues: {
            name: '',
        },
    });

    const handleDeleteCategory = () => {
        alert('delete');
    };

    const onSubmit = async (values: z.infer<typeof CreateGender>) => {
        if (!values.name) return;

        setLoading(true);
        setSuccess(false);
        setErrorMessage('');

        if (action === 'create') {
            try {
                const res = await fetch('/api/genders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: values.name }),
                });

                if (res.ok) {
                    await res.json();
                    router.refresh();
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
        }

        if (action === 'update' && idGender) {
            try {
                const res = await fetch(`/api/genders?id=${idGender}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: values.name }),
                });

                if (res.ok) {
                    await res.json();
                    router.refresh();
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
        }

        if (action === 'delete' && idGender) {
            try {
                const res = await fetch(`/api/genders?id=${idGender}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    await res.json();
                    router.refresh();
                    setSuccess(true);
                } else {
                    const error = await res.json();
                    setErrorMessage(error.error || 'An error occurred');
                }
            } catch (error) {
                console.error('Error deleting gender:', error);
                setErrorMessage('An error occurred, please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const setDefaultCategory = async () => {
            if (action === 'update' && idGender) {
                try {
                    const res = await fetch(`/api/genders?id=${idGender}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await res.json();
                    if (data) {
                        form.setValue('name', data.name);
                    }
                } catch (error) {
                    console.error('An error occurred while fetching category:', error);
                }
            }
        };

        setDefaultCategory();
    }, []);

    return (
        <Modal
            open={open}
            openChange={(value) => {
                setOpen(value);
                setErrorMessage('');
                setSuccess(false);
                if (!value) router.back();
                if (success) {
                    router.push('/dashboard/product/new');
                }
            }}
            title={`${action} Gender`}
            loading={loading}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    {action !== 'delete' ? (
                        <div>
                            <InputField
                                name="name"
                                label="Name Gender :"
                                className="bg-slate-200 focus:bg-white"
                                placeholder="Please enter your name category"
                            />
                            <div className="mt-2">
                                <FormSuccess message={success ? 'Performed successfully' : ''} />
                                <FormError message={errorMessage} />
                            </div>

                            <div className="float-right space-x-2 pt-4">
                                <Button
                                    type="button"
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
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 flex w-full flex-col gap-4">
                            <p className="text-red-600">
                                Warning: You are about to delete this gender and all associated products. This action
                                cannot be undone!
                            </p>
                            <p className="text-sm text-gray-700">
                                Note: Products related to this gender will be impacted and cannot be recovered after
                                deletion.
                            </p>
                            <div className="mt-4 flex w-full flex-row gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex min-h-12 flex-1 bg-slate-50 uppercase"
                                >
                                    cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    className="flex min-h-12 flex-1 uppercase"
                                    onClick={handleDeleteCategory}
                                >
                                    ok
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </Modal>
    );
}
