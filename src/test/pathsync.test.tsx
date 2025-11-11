import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PathSync } from '../App';
import { useGlobalStore } from '../stores/useGlobalStore';
import { expect, test, vi } from 'vitest';

test('PathSync updates current page when route changes', async () => {

    const setPage = vi.fn();
    const setVisible = vi.fn();
    const setCurrentPage = vi.fn();

    useGlobalStore.setState({
        current_page: 'Home',
        setPage,
        setCurrentPage,
        setVisible,
        pages: [
            { page_name: 'Home', active: false, visible: false, hovered: false, id: 0 },
            { page_name: 'Contact', active: false, visible: false, hovered: false, id: 1 }, 
            { page_name: 'Animation', active: false, visible: false, hovered: false, id: 2 }, 
            { page_name: 'Computers', active: false, visible: false, hovered: false, id: 3 },
            { page_name: 'Art', active: false, visible: false, hovered: false, id: 4 },
        ]
    } as Partial<ReturnType<typeof useGlobalStore.getState>>);
    
    render(
        <MemoryRouter initialEntries={['/animation']} >
            <PathSync />
        </MemoryRouter>
    );
    await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith('Animation', true);
        expect(setCurrentPage).toHaveBeenCalledWith('Animation');
        expect(setVisible).toHaveBeenCalledWith('Animation', true);
    })
    
});

