'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import Modal from '@/components/modal';
import { CategoryModalSchema, type CategoryModalForm } from '@/schema/product';
import { createCategory, deleteCategory, updateCategory, getGenders } from '@/actions/create-product';
import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { Gender } from '@prisma/client';

export default function CategoryModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const idCategory = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [genders, setGenders] = useState<Gender[]>([]);
    const form = useForm<CategoryModalForm>({
        resolver: zodResolver(CategoryModalSchema),
        defaultValues: {
            name: '',
            genderId: '',
        },
    });

    const handleDeleteCategory = async () => {
        if (!idCategory) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const result = await deleteCategory(idCategory);
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

    const onSubmit = async (values: CategoryModalForm) => {
        if (!values.name || !values.genderId) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let result;

            switch (action) {
                case 'create':
                    result = await createCategory(values);
                    break;
                case 'update':
                    if (idCategory) result = await updateCategory(idCategory, values);
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
        const fetchGenders = async () => {
            const result = await getGenders();
            if (result.success) {
                setGenders(result.data);
            } else {
                setErrorMessage(result.error);
            }
        };

        fetchGenders();
    }, []);

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <InputField
                            name="name"
                            label="Category Name :"
                            className="bg-slate-200 focus:bg-white"
                            placeholder="Please enter category name"
                        />

                        <FormField
                            control={form.control}
                            name="genderId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender:</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl className="bg-slate-200">
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select a gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {genders.map((item) => (
                                                <SelectItem className="capitalize" value={item.id} key={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-2">
                            <FormSuccess message={successMessage} />
                            <FormError message={errorMessage} />
                        </div>

                        <div className="float-right flex space-x-2 pt-4">
                            <Button
                                size="lg"
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                Close
                            </Button>
                            <Button size="lg" type="submit" disabled={loading} className="flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <Save />}
                                {loading ? 'Saving ...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
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
                            type="submit"
                            className="flex min-h-10 flex-1"
                            onClick={handleDeleteCategory}
                        >
                            {loading && <Loader2 className="h-8 w-8 animate-spin" />}
                            {loading ? 'Delete ...' : 'Ok'}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
