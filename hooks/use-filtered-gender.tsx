'use client';
import { Category, Gender, DetailCategory } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import { UseFormResetField } from 'react-hook-form';

export const useFilteredGender = (
    selectedGender: Gender | undefined,
    selectedCategory: Category | undefined,
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
        if (selectedGender) {
            resetField('category');
            resetField('detailCategory');
        }
    }, [selectedGender, resetField]);

    useEffect(() => {
        if (selectedCategory) {
            resetField('detailCategory');
        }
    }, [selectedCategory, resetField]);

    return { filteredCategories, filteredDetailCategories };
};
