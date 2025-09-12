import { createContext } from 'react';
import { IAuthContext } from '../auth.types';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
