import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../lib/auth', async () => {
  const actual = await vi.importActual<typeof import('../../lib/auth')>('../../lib/auth');
  return {
    ...actual,
    getActiveUser: vi.fn(),
    isAuthenticated: vi.fn(),
  };
});

let HistoryPage: typeof import('.')['default'];
let getActiveUser: typeof import('../../lib/auth')['getActiveUser'];
let isAuthenticated: typeof import('../../lib/auth')['isAuthenticated'];

type MockedFn<T extends (...args: any[]) => any> = ReturnType<typeof vi.fn<T>>;

let mockedGetActiveUser: MockedFn<typeof getActiveUser>;
let mockedIsAuthenticated: MockedFn<typeof isAuthenticated>;

describe('HistoryPage', () => {
  beforeAll(async () => {
    const authModule = await import('../../lib/auth');
    getActiveUser = authModule.getActiveUser;
    isAuthenticated = authModule.isAuthenticated;
    mockedGetActiveUser = getActiveUser as unknown as MockedFn<typeof getActiveUser>;
    mockedIsAuthenticated = isAuthenticated as unknown as MockedFn<typeof isAuthenticated>;
    const historyModule = await import('.');
    HistoryPage = historyModule.default;
  });
  beforeEach(() => {
    localStorage.clear();
    mockedGetActiveUser.mockReturnValue(null);
    mockedIsAuthenticated.mockReturnValue(false);
  });

  afterEach(() => {
    mockedGetActiveUser.mockClear();
    mockedIsAuthenticated.mockClear();
  });

  it(
    'renders guest view without timeline',
    async () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/history' }]}> 
          <HistoryPage />
        </MemoryRouter>,
      );

      expect(isAuthenticated()).toBe(false);

      const guestCta = await screen.findByTestId('history-guest-cta', undefined, { timeout: 10000 });
      expect(guestCta).toHaveTextContent(/Đăng nhập để mở khóa/i);

      const previewTimeline = await screen.findByTestId('history-timeline-preview', undefined, { timeout: 10000 });
      expect(previewTimeline).toBeInTheDocument();

      const previewHint = await screen.findByText(/Đăng nhập để mở khóa nội dung đầy đủ/i);
      expect(previewHint).toBeInTheDocument();
    },
    { timeout: 20000 },
  );

  it(
    'shows timeline for authenticated users',
    async () => {
      mockedGetActiveUser.mockReturnValue({ id: 'tester', fullName: 'Tester', email: 'tester@example.com' });
      mockedIsAuthenticated.mockReturnValue(true);

      render(
        <MemoryRouter initialEntries={[{ pathname: '/history' }]}> 
          <HistoryPage />
        </MemoryRouter>,
      );

      expect(isAuthenticated()).toBe(true);

      const authTimeline = await screen.findByTestId('history-timeline-auth', undefined, { timeout: 10000 });
      expect(authTimeline).toBeInTheDocument();

      const instruction = await screen.findByText(/Chọn mốc trong dòng thời gian để xem chi tiết và mở quiz\./i);
      expect(instruction).toBeInTheDocument();
    },
    { timeout: 20000 },
  );
});
