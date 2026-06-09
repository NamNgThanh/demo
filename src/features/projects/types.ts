export interface ProjectDetail {
  ID_DU_AN_CT: string;
  ID_DU_AN: string;
  NHOM_DU_AN: string;
  TEN_DU_AN_CT: string;
  DS_HANG_MUC: string;
  TY_TRONG: number;
  PHAN_BO: number;
  DEADLINE: string;
  TREO_THUONG: number;
  THUC_TE: number;
  BANG_CHUNG: string;
  TINH_TRANG: string;
}

export interface Project {
  ID_DU_AN: string;
  NGAY_DU_AN: Date;
  LOAI_DU_AN: { LOAI_DU_AN: string };
  ID_PLHD: string;
  DOI_TAC: string;
  NHOM_DU_AN: { NHOM_DU_AN: string }[];
  NGAY_DK_BAT_DAU: Date;
  NGAY_DK_HOAN_THANH: Date;
  THUC_TE: string | null;
  DS_DU_AN_CT: any[];
}
