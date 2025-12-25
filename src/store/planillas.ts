import type { IPlanilla } from '@datatypes/datatypes';
import { atom } from 'nanostores';

export const $planillas = atom<IPlanilla[]>([])

export function addUser(planilla: IPlanilla) {
  $planillas.set([...$planillas.get(), planilla]);
}
