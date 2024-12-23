import type { SessionResource } from '@clerk/types';

function checkUserRole(session: SessionResource | null): string | null {
  if (
    !session ||
    !session.user ||
    !session.user.organizationMemberships?.[0]?.role
  ) {
    return null;
  }

  return session.user.organizationMemberships[0].role.toLowerCase();
}

export { checkUserRole };
