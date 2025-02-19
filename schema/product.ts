import { z } from 'zod';

export const ImagesSchema = z
    .array(
        z.object({
            file: z.union([z.instanceof(File), z.string()]),
            key: z.string(),
            progress: z.union([z.literal('PENDING'), z.literal('COMPLETE'), z.literal('ERROR'), z.number()]),
        }),
    )
    .min(1, 'At least one image must be selected')
    .refine((arr) => arr.every((item) => item.progress !== 'ERROR' || item === undefined), {
        message: 'Please check image uploader ',
    });

export const ThumbnailSchema = z.preprocess(
    (input) => {
        if (input instanceof File || typeof input === 'string') return input;
        return undefined;
    },
    z.union([
        z.instanceof(File, { message: 'Thumbnail is required' }),
        z.string().min(1, { message: 'Thumbnail is required' }),
    ]),
);

export const CreateProductSchema = z
    .object({
        name: z
            .string({ required_error: 'Product name is required' })
            .min(1, 'Product name is required')
            .min(6, 'Product name must be more than 6 characters')
            .max(32, 'Product name must be less than 32 characters'),

        description: z
            .string({ required_error: 'Product description is required' })
            .min(1, 'Product description is required')
            .min(6, 'Product description must be more than 6 characters')
            .max(150, 'Product description must be less than 150 characters'),

        price: z.coerce.number().min(1, 'Price is required').positive('Price must be a positive number'),

        quantity: z.coerce
            .number()
            .min(1, 'Quantity is required')
            .positive('Quantity must be a positive number')
            .int('Quantity must be an integer'),

        promotions: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            startDay: z.date(),
            endDay: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),

        thumbnailFile: ThumbnailSchema,
        imageFiles: ImagesSchema,

        stock: z.coerce.number().min(1, 'Stock is required').positive('Stock must be a positive number'),
        discount: z.coerce.number().optional(),

        gender: z.object({
            id: z.string().min(1, 'Gender ID is required'),
            name: z.string().min(1, 'Gender name is required'),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),

        category: z.object({
            id: z.string().min(1, 'Category ID is required'),
            name: z.string().min(1, 'Category name is required'),
            createdAt: z.date(),
            updatedAt: z.date(),
            genderId: z.string().min(1, 'Gender ID in category is required'),
        }),

        detailCategory: z.object({
            id: z.string().min(1, 'DetailCategory ID is required'),
            name: z.string().min(1, 'DetailCategory name is required'),
            createdAt: z.date(),
            updatedAt: z.date(),
            categoryId: z.string().min(1, 'Category ID in DetailCategory is required'),
        }),
    })
    .superRefine((data, ctx) => {
        if (!data.gender.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['gender'],
                message: 'Gender is required',
            });
        }
        if (!data.category.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['category'],
                message: 'Category is required.',
            });
        }
        if (!data.detailCategory.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['detailCategory'],
                message: 'DetailCategory is required.',
            });
        }

        if (data.category.genderId !== data.gender.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['category'],
                message: 'Category must belong to the selected gender',
            });
        }
        if (data.detailCategory.categoryId !== data.category.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['detailCategory'],
                message: 'DetailCategory must belong to the selected category',
            });
        }

        if (data.discount && data.discount < 0) {
            ctx.addIssue({
                code: 'custom',
                path: ['discount'],
                message: ' Discount must be a positive number',
            });
        }
        if (data.price < data.stock) {
            ctx.addIssue({
                code: 'custom',
                path: ['price'],
                message: 'Price should not be greater than Stock',
            });
        }
        if (data.discount && data.price - data.price * (data.discount / 100) < data.price) {
            ctx.addIssue({
                code: 'custom',
                path: ['discount'],
                message: 'Discounted price should not be greater than the original price',
            });
        }
    });
