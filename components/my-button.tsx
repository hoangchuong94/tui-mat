import React from 'react';
import { Button } from './ui/button';

interface MyButtonProps {}

export const MyButton = ({ label }: { label: string }) => {
    return (
        <button className="btn-navbar w-10 bg-white">
            <span className="icon">
                <svg viewBox="0 0 175 80" width="40" height="40">
                    <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                    <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                    <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                </svg>
            </span>
            <span className="text">{label}</span>
        </button>
    );
};
