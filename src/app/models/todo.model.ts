import * as moment from 'moment';

export interface TodoModel {
  completed: boolean;
  date?: string;
  description?: string;
  label: string;
  time?: string;
}
