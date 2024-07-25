import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor() {}
}

export function createCellValue(dataset: Dataset) {
  return '${' + dataset.db + '.' + dataset.fieldName + '}';
}

export interface Dataset {
  db: string;
  fieldName: string;
  fieldText: string;
}
