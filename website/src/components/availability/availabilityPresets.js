// Availability answers two independent questions for the reader:
//   engine:  which dbt version line does this apply to? (v1 | v2 | all/omitted)
//   surface: where does this feature live? (local | local_development | platform | everywhere/omitted)
//   access:  what do I need to use it? (free | login_required | paid_plan | usage_based)
//
// These facets are independent — any can render without the others.
//
// Example frontmatter:
//   availability: platform_login
// or, for paid-plan features (minPlan is a tier and everything above it — "starter" means starter+):
//   availability:
//     engine: v2
//     surface: platform
//     access: paid_plan
//     minPlan: starter
// plans: [...] is still supported as an explicit list, for the rare feature that
// doesn't follow the tier ladder (e.g. Starter-only, with no Enterprise equivalent).

export const FIELD_LABELS = {
  engine: 'Версия',
  surface: 'Где доступно',
  access: 'Доступ',
  usage: 'Оплата',
};

// v1 = dbt Core 1.x (1.99 and earlier). v2 = dbt Fusion engine 2.0 and later.
// "all" (or omitted) means the content applies to both lines — no badge segment renders,
// same hide-if-universal rule used elsewhere in this file.
export const ENGINE_LABELS = {
  v1: 'Доступно в v1',
  v2: 'Доступно в v2',
};

export const ENGINE_TOOLTIPS = {
  v1: 'Доступно в v1',
  v2: 'Доступно в v2',
};

export function getEngineFacet(engine) {
  const label = ENGINE_LABELS[engine];
  if (!label) {
    return null;
  }
  return { facet: label, tooltip: ENGINE_TOOLTIPS[engine] };
}

// local and local_development render the same "Локальная разработка" badge — the
// distinction (CLI-only vs platform-compatible) lives in the tooltip, not the chip.
export const SURFACE_LABELS = {
  local: 'Локальная разработка',
  local_development: 'Локальная разработка',
  platform: 'Платформа dbt',
};

export const SURFACE_TOOLTIPS = {
  local: 'Работает локально.',
  local_development: 'Работает локально с проектами на платформе dbt и с локальными проектами dbt.',
  platform: 'Доступно на платформе dbt.',
};

// Link text within a SURFACE_TOOLTIPS entry, keyed by surface.
export const SURFACE_TOOLTIP_LINKS = {
  local_development: {
    href: '/docs/platform/dbt-cli-installation',
    text: 'платформе dbt',
  },
};

export const PLAN_LABELS = {
  developer: 'Developer',
  starter: 'Starter',
  enterprise: 'Enterprise',
  enterprise_plus: 'Enterprise+',
};

// Order matters: minPlan expands to this tier and everything after it ("and up").
const PLAN_TIER_ORDER = ['developer', 'starter', 'enterprise', 'enterprise_plus'];

const LOGIN_REQUIRED_FACET = {
  facet: 'Требуется вход',
  tooltip: 'Войдите в аккаунт dbt. Платная лицензия dbt не нужна.',
  tooltipLink: { href: 'https://www.getdbt.com/pricing', text: 'Платная лицензия dbt' },
};

function planListLabel(plans) {
  const labels = plans.map((plan) => PLAN_LABELS[plan] || plan);
  if (labels.length <= 1) {
    return labels.join('');
  }
  return `${labels.slice(0, -1).join(', ')}, ${labels[labels.length - 1]}`;
}

function planTooltip(plans) {
  return `Требуется тариф: ${planListLabel(plans)}.`;
}

// minPlan is the common case: a tier and everything above it ("starter" -> starter+enterprise+enterprise_plus).
// plans is an explicit list, for the rare feature that doesn't follow the tier ladder.
function resolvePlans(minPlan, plans) {
  if (minPlan) {
    const index = PLAN_TIER_ORDER.indexOf(minPlan);
    return index === -1 ? [] : PLAN_TIER_ORDER.slice(index);
  }
  return plans && plans.length ? plans : [];
}

// Returns an ordered list of { facet, tooltip } for the access badge/tooltip rows.
export function getAccessFacets(access, { minPlan, plans } = {}, surface) {
  switch (access) {
    case 'free':
      // Free is only rendered paired with the platform surface (rule: bare "dbt platform"
      // badge could read as paid). Local and unspecified surfaces default to free implicitly.
      return surface === 'platform' ? [{ facet: 'Бесплатно', tooltip: 'Аккаунт не нужен.' }] : [];
    case 'login_required':
      // On the platform surface, a login requirement is redundant — you can't use dbt
      // platform without an account, so it's collapsed away (same pattern as "free" above).
      // Local and unspecified surfaces still show it since login isn't implied there.
      return surface === 'platform' ? [] : [LOGIN_REQUIRED_FACET];
    case 'usage_based':
      return [
        ...(surface === 'platform' ? [] : [LOGIN_REQUIRED_FACET]),
        { facet: 'Оплата по использованию', tooltip: 'Оплата зависит от объёма использования.', label: FIELD_LABELS.usage },
      ];
    case 'paid_plan': {
      const planList = resolvePlans(minPlan, plans);
      if (!planList.length) {
        return [];
      }
      return [{ facet: planListLabel(planList), tooltip: planTooltip(planList) }];
    }
    default:
      return [];
  }
}

export const availabilityPresets = {
  all_users: {
    description: 'Applies to every dbt user, regardless of surface. No badge is rendered.',
    access: 'free',
  },
  platform_login: {
    description: 'dbt platform features available to all signed-in users.',
    surface: 'platform',
    access: 'login_required',
  },
  platform_usage: {
    description: 'dbt platform features available to all signed-in users and billed on usage.',
    surface: 'platform',
    access: 'usage_based',
  },
  local_free: {
    description: 'Local CLI tools with no login required.',
    surface: 'local',
    access: 'free',
  },
  local_all: {
    description: 'Local tools for open-source dbt Core and dbt platform-connected projects, any version.',
    surface: 'local_development',
  },
  everywhere_usage: {
    description: 'Cross-surface features that need a dbt account and are billed on usage.',
    access: 'usage_based',
  },
};
