'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddCategoryModal() {
    const router = useRouter();

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) router.back();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm danh mục mới</DialogTitle>
                </DialogHeader>
                <Input placeholder="Tên danh mục" />
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        Hủy
                    </Button>
                    <Button type="submit">Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
