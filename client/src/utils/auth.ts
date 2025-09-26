import { jwtDecode } from "jwt-decode";

interface JwtPayLoad {
  exp: number;
  id: string;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decode: JwtPayLoad = jwtDecode(token);
    const now = Date.now() / 1000;
    return decode.exp < now;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true;
  }
};
