import { setTransport } from '../http';
import { mockTransport, resetMockState } from './transport';

export { mockTransport, resetMockState };
export { mockCategories, mockPassword, mockProducts, mockUser } from './data';

export const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

/** Chamado uma vez no main.tsx quando VITE_USE_MOCKS=true. */
export function installMocks(): void {
    setTransport(mockTransport);
}
