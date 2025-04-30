'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Category } from '@prisma/client';

import { Form } from '@/components/ui/form';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DetailCategoryModalSchema, DetailCategoryModalSchemaType } from '@/schema/product';
import {
    createDetailCategory,
    deleteDetailCategory,
    getCategoriesByGenderId,
    getDetailCategoryById,
    updateDetailCategory,
} from '@/actions/create-product';
import { InputField, PopoverSelectField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { LoadingSkeletonUpdateDetailCategoryForm } from '@/components/loading-skeleton';
import Modal from '@/components/modal';

export default function DetailCategoryModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const idDetailCategory = searchParams.get('id');
    const genderId = searchParams.get('genderId');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<DetailCategoryModalSchemaType>({
        resolver: zodResolver(DetailCategoryModalSchema),
        defaultValues: {
            name: '',
            categoryId: '',
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
        if (!idDetailCategory) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const result = await deleteDetailCategory(idDetailCategory);
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

    const onSubmit = async (values: DetailCategoryModalSchemaType) => {
        if (!values.name) return;
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let result;

            switch (action) {
                case 'create':
                    result = await createDetailCategory(values);
                    break;
                case 'update':
                    if (idDetailCategory) result = await updateDetailCategory(idDetailCategory, values);
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
        if (action === 'update' && idDetailCategory) {
            const fetchData = async () => {
                setIsFetching(true);
                const { data, success, error } = await getDetailCategoryById(idDetailCategory);
                if (success && data) form.reset(data);
                else setErrorMessage(error);
                setIsFetching(false);
            };

            fetchData();
        }
    }, [action, idDetailCategory, form]);

    useEffect(() => {
        if (action === 'create' && genderId) {
            const fetchCategories = async () => {
                const { success, data, error } = await getCategoriesByGenderId(genderId);
                if (success && data) setCategories(data);
                else setErrorMessage(error);
            };

            fetchCategories();
        }
    }, [action, genderId]);

    return (
        <Modal title={`${action} Detail Category`} open={open} openChange={toggleModal}>
            {action !== 'delete' ? (
                <div>
                    {isFetching ? (
                        <LoadingSkeletonUpdateDetailCategoryForm />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <InputField
                                    name="name"
                                    label="Detail Category Name:"
                                    placeholder="Please enter detail category name"
                                    className="bg-slate-200 focus:bg-white"
                                    disabled={loading}
                                />
                                <PopoverSelectField
                                    className="w-[462px] p-0"
                                    name="categoryId"
                                    label="Category :"
                                    items={categories}
                                    getItemKey={(item) => item.id}
                                    getItemName={(item) => item.name}
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
                                        onClick={() => router.back()}
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
                        Warning: This will delete the detail category. This action is irreversible.
                    </p>
                    <div className="mt-4 flex w-full flex-row gap-4">
                        {!loading && (
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => router.back()}
                                className="flex min-h-10 flex-1"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            type="button"
                            className="flex min-h-10 flex-1"
                            onClick={handleDelete}
                        >
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
