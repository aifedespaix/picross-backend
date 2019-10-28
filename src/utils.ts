import {verify} from 'jsonwebtoken';
import {Context} from './context';

export const APP_SECRET = 'appsecret321';

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && verifiedToken.userId;
  }
}
export function verifyMap(map: string) {
  try {
    const testMap: number[][] = JSON.parse(map);
    // console.log(testMap);
    const colLength = testMap.length;
    const rowLength = testMap[0].length;
    for(const row of testMap) {
      if(row.length !== rowLength) {
        throw new Error();
      }
      let colLength_2 = 0;
      for(const state of row) {
        colLength_2++;
        if(state !== 0 && state !== 1) {
          throw new Error();
        }
      }
      if(colLength_2 !== colLength) {
        throw new Error();
      }
    }
  } catch (e) {
    throw new Error('Invalid Map');
  }
}

/** todo
 * Dsl Pas secure, c'est en dur PTDRR
 */
export function verifySetAdminPassword(password: string) {
  if(password !== "oi,spudhfcgàIJSX ?T XIOC0I° 3434C I0°T 56'(546(y") {
    throw new Error()
  }
}
