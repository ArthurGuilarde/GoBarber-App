import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface singInProps {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  user: object;
}

interface AuthProps {
  user: object;
  loading: boolean;
  singIn(credentials: singInProps): Promise<void>;
  singOut(): void;
}

const AuthContext = createContext<AuthProps>({} as AuthProps);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const token = await AsyncStorage.getItem('@Gobarber:token');
      const stringUser = await AsyncStorage.getItem('@Gobarber:user');

      if (token && stringUser) {
        const user = JSON.parse(stringUser);
        setData({ token, user });
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const singIn = useCallback(async ({ email, password }: singInProps) => {
    const response = await api.post('sessions', {
      email,
      password
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)]
    ]);

    setData({
      token,
      user
    });
  }, []);

  const singOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, singIn, singOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('We need one context');
  }

  return context;
}

export { AuthProvider, useAuth };
