'use client';
import { MultiImageDropzone, type FileState } from '@/components/multi-image-dropzone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UploadedImage } from '@/types';
import { useEdgeStore } from '@/lib/edgestore';

interface UploadImagesProps {
    setUrls: React.Dispatch<React.SetStateAction<string[]>>;
    onChange: (files: FileState[]) => void;
    initialFilesState?: FileState[];
    className?: string;
}

export const UploadImages = ({ setUrls, onChange, initialFilesState = [], className }: UploadImagesProps) => {
    const { edgestore } = useEdgeStore();
    const [fileStates, setFileStates] = useState<FileState[]>(initialFilesState);
    const previousFileStates = useRef<FileState[]>([]);

    const updateFileProgress = useCallback(
        (key: string, progress: FileState['progress']) => {
            setFileStates((fileStates) => {
                const newFileStates = structuredClone(fileStates);
                const fileState = newFileStates.find((fileState) => fileState.key === key);
                if (fileState) {
                    fileState.progress = progress;
                }
                return newFileStates;
            });
        },
        [setFileStates],
    );

    const uploadImages = useCallback(
        async (addedFiles: FileState[]) => {
            const data = await Promise.all(
                addedFiles.map(async (file) => {
                    if (file.file instanceof File) {
                        try {
                            const res = await edgestore.publicImages.upload({
                                file: file.file,
                                input: { type: 'product' },
                                options: {
                                    temporary: true,
                                },
                                onProgressChange: async (progress) => {
                                    updateFileProgress(file.key, progress);
                                    if (progress === 100) {
                                        await new Promise((resolve) => setTimeout(resolve, 1000));
                                        updateFileProgress(file.key, 'COMPLETE');
                                    }
                                },
                            });
                            return res;
                        } catch (err: unknown) {
                            console.error('Error sending verification email:', err);
                            updateFileProgress(file.key, 'ERROR');
                        }
                    } else {
                        updateFileProgress(file.key, 'ERROR');
                    }
                }),
            );
            return data;
        },
        [edgestore, updateFileProgress],
    );

    const handleOnChange = (files: FileState[]) => {
        setFileStates(files);
    };

    const handleOnFilesAdded = useCallback(
        async (addedFiles: FileState[]) => {
            setFileStates((prevFileStates) => [...prevFileStates, ...addedFiles]);
            const imageUploader = await uploadImages(addedFiles);
            const validImages = imageUploader.filter((img): img is UploadedImage => img !== null && img !== undefined);
            const urlsUploaded = validImages.map((item) => item.url);
            setUrls((prev) => [...prev, ...urlsUploaded]);
        },
        [uploadImages, setUrls, setFileStates],
    );

    useEffect(() => {
        if (JSON.stringify(previousFileStates.current) !== JSON.stringify(fileStates)) {
            onChange(fileStates);
            previousFileStates.current = fileStates;
        }
    }, [fileStates, setUrls, onChange]);

    return (
        <MultiImageDropzone
            className={className}
            value={fileStates}
            dropzoneOptions={{
                maxFiles: 6,
            }}
            onChange={handleOnChange}
            onFilesAdded={handleOnFilesAdded}
        />
    );
};
