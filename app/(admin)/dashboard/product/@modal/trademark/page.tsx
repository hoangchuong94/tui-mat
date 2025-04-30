'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import Modal from '@/components/modal';
import { TrademarkModalSchema, TrademarkModalSchemaType } from '@/schema/product';
import { createTrademark, updateTrademark, deleteTrademark, getTrademarkById } from '@/actions/create-product';

import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { LoadingSkeletonUpdateTrademark } from '@/components/loading-skeleton';

export default function TrademarkModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const idTrademark = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const form = useForm<TrademarkModalSchemaType>({
        resolver: zodResolver(TrademarkModalSchema),
        defaultValues: {
            name: '',
        },
    });

    const toggleModal = useCallback(
        (isOpen: boolean) => {
            setOpen(isOpen);
            if (!isOpen) {
                router.back();
                setErrorMessage('');
                setSuccessMessage('');
            }
        },
        [router],
    );

    const handleDelete = async () => {
        if (!idTrademark) return;
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const result = await deleteTrademark(idTrademark);
            if (result.success) {
                toggleModal(false);
            } else {
                setErrorMessage(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: TrademarkModalSchemaType) => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            let result;
            if (action === 'create') {
                result = await createTrademark(values);
            } else if (action === 'update' && idTrademark) {
                result = await updateTrademark(idTrademark, values);
            }
            if (result?.success) {
                setSuccessMessage(result.message);
            } else {
                setErrorMessage(result?.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (action === 'update' && idTrademark) {
            const fetchData = async () => {
                setIsFetching(true);
                const { data, success, error } = await getTrademarkById(idTrademark);
                if (success && data) form.reset(data);
                else setErrorMessage(error);
                setIsFetching(false);
            };
            fetchData();
        }
    }, [action, idTrademark, form]);

    return (
        <Modal title={`${action} Trademark`} open={open} openChange={toggleModal}>
            {action !== 'delete' ? (
                <>
                    {isFetching ? (
                        <LoadingSkeletonUpdateTrademark />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <InputField
                                    name="name"
                                    label="Trademark Name:"
                                    placeholder="Please enter trademark name"
                                    disabled={loading}
                                />
                                <div className="mt-2">
                                    <FormSuccess message={successMessage} />
                                    <FormError message={errorMessage} />
                                </div>

                                <div className="float-right flex space-x-2 pt-4">
                                    <Button
                                        disabled={loading}
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save />}
                                        {loading ? 'Saving ...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </>
            ) : (
                <div className="mt-4 flex flex-col gap-4">
                    <p className="text-red-600">Warning: This will permanently delete this trademark.</p>
                    <div className="mt-4 flex gap-4">
                        <Button variant="outline" onClick={() => router.back()} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="flex-1">
                            {loading && <Loader2 className="h-8 w-8 animate-spin" />}
                            {loading ? 'Deleting...' : 'Confirm'}
                        </Button>
                    </div>
                    <FormError message={errorMessage} />
                </div>
            )}
        </Modal>
    );
}
