import { Image, Category, Color, Promotion, DetailCategory, Gender } from '@prisma/client';

export type DataCreateProduct = {
    categories: Category[];
    detailCategories: DetailCategory[];
    genders: Gender[];
    promotions: Promotion[];
};

export type UploadedImage = {
    url: string;
    thumbnailUrl: string | null;
    size: number;
    uploadedAt: Date;
    metadata: Record<string, never>;
    path: {
        type: string;
    };
    pathOrder: 'type'[];
};

export type ProductDetail = {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    capacity: number;
    thumbnail: string;
    images: Image[];
    colors: Color[];
    promotions: Promotion[];
    detailCategory: DetailCategory;
    subCategory: Gender;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
};

export interface CreateProductFormValues {
    name: string;
    description: string;
    price: number;
    quantity: number;
    promotions: Promotion[];
    gender: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    };
    category: Category;
    detailCategory: DetailCategory;
    stock: number;
    discount: number;
    thumbnailFile: string;
    imageFiles: string[];
    discountType: string;
}
