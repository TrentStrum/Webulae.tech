import { createContext, useContext, useCallback, useState } from 'react';

import { CreateForm } from '@/src/components/modals/create-form';
import { DeleteConfirmation } from '@/src/components/modals/delete-confirmation';
import { EditForm } from '@/src/components/modals/edit-form';
import { InviteMembers } from '@/src/components/modals/invite-members';
import { SettingsForm } from '@/src/components/modals/settings-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog';
import { useAuth } from '@/src/hooks/auth/useAuth';

import type { AuthContextType } from '@/src/lib/auth/auth-context';
import type { Permission } from '@/src/types/permissions.types';

type ModalType = 'delete' | 'create' | 'edit' | 'invite' | 'settings';

export interface ModalProps {
  onClose: () => void;
  [key: string]: unknown;
}

interface ModalConfig {
  title: string;
  description?: string;
  permission?: Permission;
  component: React.ComponentType<ModalProps>;
}

const MODAL_CONFIGS: Record<ModalType, ModalConfig> = {
  delete: {
    title: 'Confirm Deletion',
    description: 'This action cannot be undone.',
    permission: 'delete_items' as Permission,
    component: DeleteConfirmation,
  },
  create: {
    title: 'Create New',
    component: CreateForm,
  },
  edit: {
    title: 'Edit',
    component: EditForm,
  },
  invite: {
    title: 'Invite Members',
    permission: 'manage_users',
    component: InviteMembers,
  },
  settings: {
    title: 'Settings',
    component: SettingsForm,
  },
};

const ModalContext = createContext<{
  showModal: (type: ModalType, props?: unknown) => void;
  hideModal: () => void;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{
    type: ModalType;
    props?: unknown;
  } | null>(null);
  const { hasPermission } = useAuth() as unknown as AuthContextType;

  const showModal = useCallback((type: ModalType, props?: unknown) => {
    const config = MODAL_CONFIGS[type];
    if (config.permission && !hasPermission(config.permission)) {
      return;
    }
    setModal({ type, props });
  }, [hasPermission]);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  const ModalComponent = modal ? MODAL_CONFIGS[modal.type].component : null;
  const config = modal ? MODAL_CONFIGS[modal.type] : null;

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modal && ModalComponent && (
        <Dialog open={true} onOpenChange={hideModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{config?.title}</DialogTitle>
              {config?.description && (
                <DialogDescription>{config.description}</DialogDescription>
              )}
            </DialogHeader>
            <ModalComponent {...modal.props as ModalProps} onClose={hideModal} />
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}; 