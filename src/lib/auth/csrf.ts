import { randomBytes } from 'crypto';

export const csrfUtils = {
  generateToken: () => {
    const token = randomBytes(32).toString('hex');
    sessionStorage.setItem('csrfToken', token);
    return token;
  },

  validateToken: (token: string) => {
    const storedToken = sessionStorage.getItem('csrfToken');
    return token === storedToken;
  },

  getToken: () => sessionStorage.getItem('csrfToken'),

  clearToken: () => sessionStorage.removeItem('csrfToken')
};