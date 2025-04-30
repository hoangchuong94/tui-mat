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
            .max(32, 'Product name must be less than 32 characters')
            .transform((val) => val.trim().replace(/\s+/g, ' ')),

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

        thumbnailFile: ThumbnailSchema,
        imageFiles: ImagesSchema,

        stock: z.coerce.number().min(1, 'Stock is required').positive('Stock must be a positive number'),
        discount: z.coerce.number().optional(),
        origin: z
            .string({ required_error: 'Origin name is required' })
            .min(1, 'Origin name is required')
            .min(6, 'Origin name must be more than 6 characters')
            .max(32, 'Origin name must be less than 32 characters'),

        gender: z.object({
            id: z.string().min(1, 'Gender ID is required'),
            name: z
                .string()
                .min(1, 'Gender name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
        }),

        category: z.object({
            id: z.string().min(1, 'Category ID is required'),
            name: z
                .string()
                .min(1, 'Category name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
            genderId: z.string().min(1, 'Gender ID in category is required'),
        }),

        detailCategory: z.object({
            id: z.string().min(1, 'DetailCategory ID is required'),
            name: z
                .string()
                .min(1, 'DetailCategory name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
            categoryId: z.string().min(1, 'Category ID in DetailCategory is required'),
        }),

        promotions: z.object({
            id: z.string(),
            name: z.string().transform((val) => val.trim().replace(/\s+/g, ' ')),
            description: z.string(),
        }),

        trademark: z.object({
            id: z.string(),
            name: z.string().transform((val) => val.trim().replace(/\s+/g, ' ')),
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

        const { price, stock, discount = 0 } = data;
        const discountedPrice = price - (price * discount) / 100;

        if (discountedPrice < stock) {
            ctx.addIssue({
                code: 'custom',
                path: ['discount'],
                message: 'Discounted price must not be less than cost (no loss allowed)',
            });
        }

        // if (data.discount && data.price - data.price * (data.discount / 100) < data.price) {
        //     ctx.addIssue({
        //         code: 'custom',
        //         path: ['discount'],
        //         message: 'Discounted price should not be greater than the original price',
        //     });
        // }
    });

export const GenderModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Gender name is required')
        .max(255, 'Gender name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
});

export const CategoryModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(255, 'Category name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    genderIds: z.array(z.string()),
});

export const DetailCategoryModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Detail category name is required')
        .max(255, 'Detail category name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    categoryId: z.string().min(1, 'Category ID in DetailCategory is required'),
});

export const PromotionModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Promotion is required')
        .max(255, 'Promotion is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    description: z.string().min(1, 'Description promotion  is required').max(255, 'Description promotion is too long'),
});

export const TrademarkModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Trademark is required')
        .max(255, 'Trademark is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
});

export type GenderModalSchemaType = z.infer<typeof GenderModalSchema>;
export type CategoryModalSchemaType = z.infer<typeof CategoryModalSchema>;
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
export type PromotionModalSchemaType = z.infer<typeof PromotionModalSchema>;
export type TrademarkModalSchemaType = z.infer<typeof TrademarkModalSchema>;
export type DetailCategoryModalSchemaType = z.infer<typeof DetailCategoryModalSchema>;
