'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import Modal from '@/components/modal';
import { GenderModalSchemaType, GenderModalSchema } from '@/schema/product';
import { LoadingSkeletonUpdateGenderForm } from '@/components/loading-skeleton';
import { createGender, deleteGender, getGenderById, updateGender } from '@/actions/create-product';
import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

export default function GenderModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const genderId = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const form = useForm<GenderModalSchemaType>({
        resolver: zodResolver(GenderModalSchema),
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

    const handleDeleteGender = async () => {
        if (!genderId) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const result = await deleteGender(genderId);
            if (result.success) {
                toggleModal(false);
            } else {
                setErrorMessage(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred, please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: GenderModalSchemaType) => {
        if (!values.name) return;
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            let result;

            switch (action) {
                case 'create':
                    result = await createGender(values);
                    break;
                case 'update':
                    if (genderId) result = await updateGender(genderId, values);
                    break;
                default:
                    throw new Error('Invalid action');
            }

            if (result?.success) {
                setSuccessMessage(result.message);
            } else {
                setErrorMessage(result?.error || 'An unknown error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred, please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (action === 'update' && genderId) {
            const fetchGenderUpdateById = async () => {
                setIsFetching(true);
                const { data, success, error } = await getGenderById(genderId);
                if (success && data) {
                    form.reset(data);
                } else {
                    setErrorMessage(error);
                }
                setIsFetching(false);
            };

            fetchGenderUpdateById();
        }
    }, [action, genderId, form]);

    useEffect(() => {
        if (!open) {
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [open]);

    return (
        <Modal title={`${action} Gender`} open={open} openChange={toggleModal}>
            {action !== 'delete' ? (
                <div>
                    {isFetching ? (
                        <LoadingSkeletonUpdateGenderForm />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <InputField
                                    name="name"
                                    label="Gender Name"
                                    className="bg-slate-200 focus:bg-white"
                                    placeholder={action !== 'update' ? 'Please enter gender name' : ''}
                                    disabled={loading}
                                />
                                <div className="mt-2">
                                    <FormSuccess message={successMessage} />
                                    <FormError message={errorMessage} />
                                </div>

                                <div className="float-right flex space-x-2 pt-4">
                                    <Button
                                        disabled={loading}
                                        size="lg"
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            router.back();
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        size="lg"
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
                </div>
            ) : (
                <div className="mt-4 flex w-full flex-col gap-4">
                    <p className="text-red-600">
                        Warning: You are about to delete this gender and all associated products. This action cannot be
                        undone!
                    </p>
                    <p className="text-sm text-gray-700">
                        Note: Products related to this gender will be impacted and cannot be recovered after deletion.
                    </p>
                    <div className="mt-4 flex w-full flex-row gap-4">
                        {!loading && (
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    router.back();
                                }}
                                className="flex min-h-10 flex-1"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            type="button"
                            className="flex min-h-10 flex-1"
                            onClick={handleDeleteGender}
                        >
                            {loading && <Loader2 className="h-8 w-8 animate-spin" />}
                            {loading ? 'Delete ...' : 'Ok'}
                        </Button>
                    </div>
                    <FormError message={errorMessage} />
                </div>
            )}
        </Modal>
    );
}
