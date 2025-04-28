'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Gender } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Modal from '@/components/modal';
import { CategoryModalSchema, CategoryModalSchemaType } from '@/schema/product';
import { InputField, PopoverSelectField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

import {
    getAllGenders,
    updateCategory,
    deleteCategory,
    createCategory,
    getCategoryById,
} from '@/actions/create-product';
import { LoadingSkeletonUpdateCategoryForm } from '@/components/loading-skeleton';

export default function CategoryModal() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const action = searchParams.get('action');
    const categoryId = searchParams.get('id');
    const genderId = searchParams.get('genderId');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [genders, setGenders] = useState<Gender[]>([]);

    const form = useForm<CategoryModalSchemaType>({
        resolver: zodResolver(CategoryModalSchema),
        defaultValues: {
            name: '',
            genderId: genderId ?? '',
        },
    });

    const { handleSubmit } = form;

    const handleDeleteCategory = async () => {
        if (!categoryId) return;

        try {
            setLoading(true);
            setErrorMessage('');
            setSuccessMessage('');

            const result = await deleteCategory(categoryId);

            if (result.success) {
                setOpen(false);
                router.back();
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

    const onSubmit = async (values: CategoryModalSchemaType) => {
        if (!values.name || !values.genderId) return;

        try {
            setLoading(true);
            setErrorMessage('');
            setSuccessMessage('');

            let result;

            switch (action) {
                case 'create':
                    result = await createCategory(values);
                    break;
                case 'update':
                    if (categoryId) result = await updateCategory(categoryId, values);
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
        if (action !== 'delete') {
            const fetchGenders = async () => {
                const { success, data, error } = await getAllGenders();
                if (success && data) {
                    setGenders(data);
                } else {
                    setErrorMessage(error || 'Failed to fetch genders');
                }
            };
            fetchGenders();
        }
    }, [action]);

    useEffect(() => {
        if (action === 'update' && categoryId) {
            const fetchCategory = async () => {
                setLoading(true);
                const { success, data, error } = await getCategoryById(categoryId);
                if (success && data) {
                    form.reset(data);
                } else {
                    setErrorMessage(error || 'Failed to fetch category');
                }
                setLoading(false);
            };
            fetchCategory();
        }
    }, [action, categoryId, form]);

    return (
        <Modal
            title={`${action} Category`}
            open={open}
            openChange={(value) => {
                setOpen(value);
                setErrorMessage('');
                if (!value) router.back();
            }}
        >
            {action !== 'delete' ? (
                <div>
                    {loading ? (
                        <LoadingSkeletonUpdateCategoryForm />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                <InputField
                                    name="name"
                                    label="Category Name:"
                                    className="bg-slate-200 focus:bg-white"
                                    placeholder="Please enter category name"
                                    disabled={loading}
                                />

                                <PopoverSelectField
                                    className="w-[462px] p-0"
                                    name="genderId"
                                    label="Gender:"
                                    items={genders}
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
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        disabled={loading}
                                        onClick={() => router.back()}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save />}
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            ) : (
                <div className="mt-4 flex w-full flex-col gap-4">
                    <p className="text-red-600">
                        Warning: You are about to delete this category and all associated products. This action cannot
                        be undone!
                    </p>
                    <p className="text-sm text-gray-700">
                        Note: Products related to this category will be impacted and cannot be recovered after deletion.
                    </p>

                    <div className="mt-4 flex w-full flex-row gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex min-h-10 flex-1"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="flex min-h-10 flex-1"
                            onClick={handleDeleteCategory}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : null}
                            {loading ? 'Deleting...' : 'Ok'}
                        </Button>
                    </div>

                    <FormError message={errorMessage} />
                </div>
            )}
        </Modal>
    );
}
