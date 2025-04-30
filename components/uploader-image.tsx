'use client';

import { useEffect, useState, useCallback } from 'react';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useEdgeStore } from '@/lib/edgestore';

interface UploadImageProps {
    initialFile: File | string;
    onChange: (file: File | string) => void;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
}

export const UploadImage = ({ initialFile: file, setUrl, onChange, className }: UploadImageProps) => {
    const { edgestore } = useEdgeStore();
    const [error, setError] = useState<string>('');
    const [isAutoUpdate, setIsAutoUpdate] = useState(true);

    const handleUpload = useCallback(
        async (file: File) => {
            try {
                const res = await edgestore.publicImages.upload({
                    file,
                    input: { type: 'thumbnail' },
                    options: { temporary: true },
                    onProgressChange: () => {},
                });
                return res;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred.');
                }
                return null;
            } finally {
                setIsAutoUpdate(false);
            }
        },
        [edgestore],
    );

    useEffect(() => {
        if (isAutoUpdate && file instanceof File) {
            handleUpload(file).then((imageUploaded) => {
                if (imageUploaded) {
                    setUrl(imageUploaded.url);
                }
            });
        }
    }, [file, isAutoUpdate, handleUpload, setUrl]);

    return (
        <>
            <SingleImageDropzone
                className={className}
                value={file}
                onChange={(newFile) => {
                    setError('');
                    setIsAutoUpdate(true);
                    onChange(newFile || '');
                }}
            />
            <p className="text-xs text-red-500">{error}</p>
        </>
    );
};
