import { authService } from './authService';

describe('authService', () => {
  it('should fetch user profile', async () => {
    const profile = await authService.getUserProfile('123');
    expect(profile).toBeDefined();
    expect(profile.id).toBe('123');
  });

  it('should update user profile', async () => {
    const updates = {
      username: 'newusername',
      full_name: 'New Name'
    };
    
    const updated = await authService.updateProfile('123', updates);
    expect(updated.username).toBe(updates.username);
    expect(updated.full_name).toBe(updates.full_name);
  });
}); 