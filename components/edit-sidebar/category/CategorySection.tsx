'use client';

import {AddCategoryButton} from './AddCategoryButton';
import {CategorySelector} from './CategorySelector';

export function CategorySection() {
    return (
        <div className="space-y-4">
            <AddCategoryButton />
            <CategorySelector />
        </div>
    );
}
