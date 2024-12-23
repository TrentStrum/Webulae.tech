import { OrganizationDataAccess } from '@/src/dataAccess/implementations/organizationDataAccess';
import { UserDataAccess } from '@/src/dataAccess/implementations/userDataAccess';
import { ProjectDataAccess } from '@/src/dataAccess/projectDataAccess';

import type { TypedSupabaseClient } from '@/src/lib/supabase/client';


export class DataAccessFactory {
  private static instance: DataAccessFactory;
  private organizationDataAccess: OrganizationDataAccess;
  private userDataAccess: UserDataAccess;
  private projectDataAccess: ProjectDataAccess;

  private constructor(private client: TypedSupabaseClient) {
    this.organizationDataAccess = new OrganizationDataAccess(client);
    this.userDataAccess = new UserDataAccess(client);
    this.projectDataAccess = new ProjectDataAccess();
  }

  static initialize(client: TypedSupabaseClient): void {
    if (!DataAccessFactory.instance) {
      DataAccessFactory.instance = new DataAccessFactory(client);
    }
  }

  static getInstance(): DataAccessFactory {
    if (!DataAccessFactory.instance) {
      throw new Error('DataAccessFactory must be initialized first');
    }
    return DataAccessFactory.instance;
  }

  getOrganizationDataAccess(): OrganizationDataAccess {
    return this.organizationDataAccess;
  }

  getUserDataAccess(): UserDataAccess {
    return this.userDataAccess;
  }

  getProjectDataAccess(): ProjectDataAccess {
    return this.projectDataAccess;
  }
} 