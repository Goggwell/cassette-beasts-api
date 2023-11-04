import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type SimplifiedMonster = {
  id: string | null;
  name: string | null;
  image: string | null;
};

export type RemasteredMonster = {
  monsters: SimplifiedMonster[] | null;
};

export type BaseStats = {
  max_hp: number;
  m_atk: number;
  m_def: number;
  r_atk: number;
  r_def: number;
  speed: number;
};

export type Images = {
  standard: string | null;
  animated: string | null;
};

export type Monster = {
  id: Generated<number>;
  beastid: string | null;
  name: string | null;
  type: string | null;
  remaster_from: RemasteredMonster | null;
  remaster_to: RemasteredMonster | null;
  base_stats: BaseStats | null;
  description: string | null;
  images: Images | null;
};
export type DB = {
  beasts: Monster;
};
