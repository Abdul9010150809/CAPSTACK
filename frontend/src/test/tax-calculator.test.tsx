import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaxCalculator from '../pages/tax-calculator';

// Mock the Layout component
vi.mock('../components/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TaxCalculator', () => {
    test('renders tax calculator page with title', () => {
        render(<TaxCalculator />);
        expect(screen.getByText(/Tax Calculator/i)).toBeTruthy();
    });

    test('displays income input section', () => {
        render(<TaxCalculator />);
        expect(screen.getByText(/Income Details/i)).toBeTruthy();
        const annualIncome = screen.getAllByText(/Annual Income/i);
        expect(annualIncome.length).toBeGreaterThan(0);
        const taxRegime = screen.getAllByText(/Tax Regime/i);
        expect(taxRegime.length).toBeGreaterThan(0);
    });

    test('shows tax summary cards', () => {
        render(<TaxCalculator />);
        expect(screen.getByText(/Taxable Income/i)).toBeTruthy();
        expect(screen.getByText(/Total Tax/i)).toBeTruthy();
        expect(screen.getByText(/Annual Take Home/i)).toBeTruthy();
        expect(screen.getByText(/Monthly Take Home/i)).toBeTruthy();
    });

    test('displays income distribution chart', () => {
        render(<TaxCalculator />);
        expect(screen.getByText(/Income Distribution/i)).toBeTruthy();
    });

    test('shows tax saving recommendations', () => {
        render(<TaxCalculator />);
        expect(screen.getByText(/Tax Saving Recommendations/i)).toBeTruthy();
    });
});
