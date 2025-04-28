'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import Modal from '@/components/modal';
import { PromotionModalSchema, PromotionModalSchemaType } from '@/schema/product';
import { createPromotion, updatePromotion, deletePromotion, getPromotionById } from '@/actions/create-product';

import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

export default function PromotionModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const idPromotion = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const form = useForm<PromotionModalSchemaType>({
        resolver: zodResolver(PromotionModalSchema),
        defaultValues: {
            name: '',
            description: '',
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
        if (!idPromotion) return;
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const result = await deletePromotion(idPromotion);
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

    const onSubmit = async (values: PromotionModalSchemaType) => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            let result;
            if (action === 'create') {
                result = await createPromotion(values);
            } else if (action === 'update' && idPromotion) {
                result = await updatePromotion(idPromotion, values);
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
        if (action === 'update' && idPromotion) {
            const fetchData = async () => {
                const { data, success, error } = await getPromotionById(idPromotion);
                if (success && data) form.reset(data);
                else setErrorMessage(error);
            };
            fetchData();
        }
    }, [action, idPromotion, form]);

    return (
        <Modal title={`${action} Promotion`} open={open} openChange={toggleModal}>
            {action !== 'delete' ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <InputField
                            name="name"
                            label="Promotion Name:"
                            placeholder="Enter promotion name"
                            disabled={loading}
                        />
                        <InputField
                            name="description"
                            label="Description"
                            placeholder="Enter description"
                            type="area"
                            disabled={loading}
                        />

                        <div className="mt-2">
                            <FormSuccess message={successMessage} />
                            <FormError message={errorMessage} />
                        </div>

                        <div className="float-right flex space-x-2 pt-4">
                            <Button disabled={loading} type="button" variant="outline" onClick={() => router.back()}>
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
            ) : (
                <div className="mt-4 flex flex-col gap-4">
                    <p className="text-red-600">Warning: This will permanently delete this promotion.</p>
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
