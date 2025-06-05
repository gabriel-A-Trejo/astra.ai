import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

// Mock next/link
jest.mock('next/link', () => {
  const ActualReact = require('react');
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return ActualReact.createElement('a', { href }, children);
  }
});

// Mock FooterLinks constant
jest.mock('@/constants/FooterLinks', () => ({
  FooterLinks: [
    { href: '/mock-terms', title: 'Mock Terms' },
    { href: '/mock-privacy', title: 'Mock Privacy' },
  ],
}));

// Re-import FooterLinks to access it directly in tests
import { FooterLinks as MockedFooterLinks } from '@/constants/FooterLinks';

describe('Footer Component', () => {
  const originalDate = global.Date;

  afterEach(() => {
    global.Date = originalDate; // Restore original Date
  });

  it('should render without crashing', () => {
    render(<Footer />);
    // A basic assertion to ensure it renders something
    expect(screen.getByText(/Astra AI/i)).toBeInTheDocument();
  });

  it('displays the current year correctly', () => {
    const mockYear = 2077;
    // Mock Date.getFullYear
    global.Date = class extends originalDate {
      constructor() {
        super();
      }
      getFullYear() {
        return mockYear;
      }
    } as any;

    render(<Footer />);
    expect(screen.getByText(`© ${mockYear} Astra AI`)).toBeInTheDocument();
  });

  it('renders all footer links correctly', () => {
    render(<Footer />);
    MockedFooterLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.title });
      expect(linkElement).toBeInTheDocument();
      // The mock for next/link renders an 'a' tag, so href will be directly on the element.
      // For URL resolution, we might need to check against the full URL if the href is relative.
      // However, since we provide absolute-looking paths in mocks, this should be fine.
      expect(linkElement).toHaveAttribute('href', link.href);
    });
  });
});
