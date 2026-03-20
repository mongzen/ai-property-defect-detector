export type DefectCategory =
  | 'Wall Cracks'
  | 'Water Leakage'
  | 'Flooring Issues'
  | 'Paint Peeling'
  | 'Mold/Mildew'
  | 'Fixture Damage'
  | 'Other';

export type Severity = 'Low' | 'Medium' | 'High';

export interface Defect {
  id: string;
  imageIndex: number;
  category: DefectCategory;
  description: string;
  severity: Severity;
  confidenceScore: number;
  recommendedAction: string;
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64Data?: string;
  mimeType?: string;
}

export interface InspectionReport {
  propertyAddress: string;
  inspectionDate: string;
  inspectorName: string;
  defects: Defect[];
}
