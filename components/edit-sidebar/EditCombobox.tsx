'use client';

import {CategorySection} from '@/components/edit-sidebar/category/CategorySection';
import * as React from 'react';

interface ComboboxDemoProps {
    onCategorySelect: (categoryId: string) => void;
}

export function ComboboxDemo({onCategorySelect}: ComboboxDemoProps) {
    return <CategorySection onCategorySelect={onCategorySelect} />;
}
