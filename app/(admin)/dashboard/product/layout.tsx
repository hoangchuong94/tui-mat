import { ReactNode } from 'react';

export default function ProductNewLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
