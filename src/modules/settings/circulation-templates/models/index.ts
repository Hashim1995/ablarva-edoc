import { selectOption } from '@/models/common';

interface ICirculationTemplateFilter {
  Name: string;
  CirculationTypeId: selectOption | null;
}

interface ICirculationTemplateItem {
  Id: number;
  Name?: string | null;
  CirculationType?: string | null;
}

export type { ICirculationTemplateFilter, ICirculationTemplateItem };
