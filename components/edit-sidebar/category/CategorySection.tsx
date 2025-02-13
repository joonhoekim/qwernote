'use client';

import {AddCategoryButton} from './AddCategoryButton';
import {CategorySelector} from './CategorySelector';

interface CategorySectionProps {
    onCategorySelect: (categoryId: string) => void;
}

export function CategorySection({onCategorySelect}: CategorySectionProps) {
    return (
        <div className="space-y-4">
            <AddCategoryButton />
            <CategorySelector onCategorySelect={onCategorySelect} />
        </div>
    );
}
