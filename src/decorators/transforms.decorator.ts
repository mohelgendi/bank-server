/* tslint:disable:naming-convention */

import { Transform } from 'class-transformer';
import * as _ from 'lodash';

export function ToInt(): any {
  return Transform((value: any) => parseInt(value, 10), { toClassOnly: true });
}
