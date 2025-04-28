'use client';
import { Category, DetailCategory, Gender } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import { UseFormResetField } from 'react-hook-form';

type FilteredGender = Pick<Gender, 'id' | 'name'>;
type FilteredCategory = Pick<Category, 'id' | 'name' | 'genderId'>;

export const useFilteredGender = (
    selectedGender: FilteredGender | undefined,
    selectedCategory: FilteredCategory | undefined,
    categories: Category[],
    detailCategories: DetailCategory[],
    resetField: UseFormResetField<any>,
) => {
    const filteredCategories = useMemo(() => {
        return selectedGender ? categories.filter((category) => category.genderId === selectedGender.id) : [];
    }, [selectedGender, categories]);

    const filteredDetailCategories = useMemo(() => {
        return selectedCategory
            ? detailCategories.filter((detailCat) => detailCat.categoryId === selectedCategory.id)
            : [];
    }, [selectedCategory, detailCategories]);

    useEffect(() => {
        if (selectedGender?.id) {
            resetField('category');
            resetField('detailCategory');
        }
    }, [selectedGender?.id, resetField]);

    useEffect(() => {
        if (selectedCategory?.id) {
            resetField('detailCategory');
        }
    }, [selectedCategory?.id, resetField]);

    return { filteredCategories, filteredDetailCategories };
};
