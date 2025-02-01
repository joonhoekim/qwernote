'use client';

import {editTempData} from '@/components/test-components/test-data/edit-temp-data';
import {Tree} from 'react-arborist';

export default function EditTree() {
    return <Tree initialData={editTempData} />;
}
