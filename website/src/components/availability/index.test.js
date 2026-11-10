import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from './index';

describe('Availability', () => {
  it('renders nothing for all_users (everywhere + free)', () => {
    const { container } = render(<Availability availability="all_users" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Платформа dbt | Бесплатно" for explicit free platform access without repeating badge values in the tooltip', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'platform', access: 'free' }} />);

    const badge = screen.getByRole('button', { name: /Платформа dbt \| бесплатно/i });
    expect(badge).toHaveTextContent('Платформа dbt | Бесплатно');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Где доступно');
    expect(tooltip).toHaveTextContent('Доступно на платформе dbt.');
    expect(tooltip).toHaveTextContent('Доступ');
    expect(tooltip).toHaveTextContent('Аккаунт не нужен.');
    expect(tooltip).not.toHaveTextContent('Платформа dbt —');
    expect(tooltip).not.toHaveTextContent('Бесплатно —');
  });

  it('renders "Платформа dbt" alone for platform_login (login is implicit on the platform surface)', async () => {
    render(<Availability availability="platform_login" />);
    const badge = screen.getByRole('button', { name: /^Платформа dbt\./i });
    expect(badge).toHaveTextContent('Платформа dbt');
    expect(badge).not.toHaveTextContent('Требуется вход');
  });

  it('renders both surfaces for a multi-surface feature', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: ['local', 'platform'] }} />);
    const badge = screen.getByRole('button', { name: /локальная разработка \| Платформа dbt/i });
    expect(badge).toHaveTextContent('Локальная разработка | Платформа dbt');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Работает локально.');
    expect(tooltip).toHaveTextContent('Доступно на платформе dbt.');
  });

  it('expands minPlan to the tier and everything above it', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{
          surface: 'platform',
          access: 'paid_plan',
          minPlan: 'starter',
        }}
      />
    );

    const badge = screen.getByRole('button', {
      name: /Платформа dbt \| starter, enterprise, enterprise\+/i,
    });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Требуется тариф: Starter, Enterprise, Enterprise+.');
    expect(tooltip).not.toHaveTextContent('Starter, Enterprise, Enterprise+ —');
  });

  it('still supports an explicit plans list for the rare non-ladder feature', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', plans: ['starter'] }}
      />
    );

    const badge = screen.getByRole('button', { name: /Платформа dbt \| starter/i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Требуется тариф: Starter.');
  });

  it('labels the v2 engine facet and renders its tooltip row', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v2', surface: 'platform', access: 'free' }} />);

    const badge = screen.getByRole('button', { name: /доступно в v2 \| Платформа dbt \| бесплатно/i });
    expect(badge).toHaveTextContent('Доступно в v2 | Платформа dbt | Бесплатно');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Версия');
    expect(tooltip).toHaveTextContent('Доступно в v2');
    expect(tooltip).not.toHaveTextContent('Доступно в v2 —');
  });

  it('renders "Доступно в v1" alone with its tooltip for engine-only availability', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v1' }} />);

    const badge = screen.getByRole('button', { name: /^доступно в v1\./i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Доступно в v1');
  });

  it('renders nothing extra for an unknown or omitted engine value', () => {
    const { container } = render(<Availability availability={{ engine: 'all' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Локальная разработка" alone for local_free (free is implicit for local CLI)', () => {
    render(<Availability availability="local_free" />);
    const badge = screen.getByRole('button', { name: /^локальная разработка\./i });
    expect(badge).toHaveTextContent('Локальная разработка');
    expect(badge).not.toHaveTextContent('Бесплатно');
  });

  it('renders linked local development guidance for local_all as a single badge chip', async () => {
    const user = userEvent.setup();
    render(<Availability availability="local_all" />);

    const badge = screen.getByRole('button', {
      name: /^локальная разработка\./i,
    });
    expect(badge).toHaveTextContent('Локальная разработка');
    expect(badge).not.toHaveTextContent('Платформа dbt');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Где доступно');
    expect(tooltip).toHaveTextContent(
      'Работает локально с проектами на платформе dbt и с локальными проектами dbt.'
    );
    expect(
      screen.getByRole('link', { name: 'платформе dbt' })
    ).toHaveAttribute('href', '/docs/platform/dbt-cli-installation');
  });

  it('renders "Локальная разработка | Требуется вход" for a local surface with login required', () => {
    render(<Availability availability={{ surface: 'local', access: 'login_required' }} />);
    expect(
      screen.getByRole('button', { name: /локальная разработка \| требуется вход/i })
    ).toBeInTheDocument();
  });

  it('renders access alone with no surface badge (login required, no surface)', () => {
    render(<Availability availability={{ access: 'login_required' }} />);
    const badge = screen.getByRole('button', { name: /^требуется вход\./i });
    expect(badge).toHaveTextContent('Требуется вход');
    expect(badge).not.toHaveTextContent('Платформа dbt');
    expect(badge).not.toHaveTextContent('Локальная разработка');
  });

  it('drops the redundant "Требуется вход" chip but keeps "Оплата по использованию" when surface is platform', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'platform', access: 'usage_based' }} />);

    const badge = screen.getByRole('button', { name: /^Платформа dbt \| оплата по использованию\./i });
    expect(badge).not.toHaveTextContent('Требуется вход');

    await user.click(badge);
    expect(screen.getByRole('tooltip')).not.toHaveTextContent('Требуется вход');
  });

  it('renders "Требуется вход | Оплата по использованию" for everywhere_usage (dbt State case)', async () => {
    const user = userEvent.setup();
    render(<Availability availability="everywhere_usage" />);

    const badge = screen.getByRole('button', { name: /требуется вход \| оплата по использованию/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Войдите в аккаунт dbt. Платная лицензия dbt не нужна.');
    expect(tooltip).toHaveTextContent('Оплата зависит от объёма использования.');
    expect(screen.getByRole('link', { name: 'Платная лицензия dbt' }))
      .toHaveAttribute('href', 'https://www.getdbt.com/pricing');
  });

  it('never renders Fusion, Core, or OSS anywhere in badge output', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', plans: ['starter', 'enterprise', 'enterprise_plus'] }}
      />
    );

    const badge = screen.getByRole('button', { name: /Платформа dbt/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).not.toMatch(/fusion|core|oss/i);
    expect(badge.textContent).not.toMatch(/fusion|core|oss/i);
  });

  it('accepts "platform" as shorthand for availability to all dbt platform users', () => {
    render(<Availability availability="platform" />);

    const badge = screen.getByRole('button', { name: /^Платформа dbt\./i });
    expect(badge).toHaveTextContent('Платформа dbt');
    expect(badge).not.toHaveTextContent('Бесплатно');
    expect(badge).not.toHaveTextContent('Требуется вход');
  });

  it('treats a platform surface without access as available to all platform users', () => {
    render(<Availability availability={{ surface: 'platform' }} />);

    const badge = screen.getByRole('button', { name: /^Платформа dbt\./i });
    expect(badge).toHaveTextContent('Платформа dbt');
    expect(badge).not.toHaveTextContent('Бесплатно');
  });

  it('renders nothing without a resolvable surface or access', () => {
    const { container } = render(<Availability availability={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens on focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'local', access: 'login_required' }} />);

    await user.tab();

    expect(screen.getByRole('button', { name: /локальная разработка \| требуется вход/i })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when clicking outside the badge', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Availability availability={{ surface: 'local', access: 'login_required' }} />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /локальная разработка \| требуется вход/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps a clicked tooltip open after mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', minPlan: 'starter' }}
      />
    );

    const badge = screen.getByRole('button', { name: /Платформа dbt \| starter/i });
    await user.click(badge);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(badge);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
