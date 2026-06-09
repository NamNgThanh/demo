export interface ProjectDetail {
  ID_DU_AN_CT: string;
  ID_DU_AN: string;
  TEN_DU_AN_CT: string;
  ID_HANG_MUC: string;
  DS_HANG_MUC: string;
  TY_TRONG: number;
  PHAN_BO: string;
  THUC_TE: string;
  TINH_TRANG: string;
  IS_BLURRED: boolean;
  
  // Nhom Phan Bo
  EMAIL_SO_HUU: string | null;
  NV_PHU_TRACH_ID: string | null;
  nvHoTroIds: string[];
  LEADER_ID: string | null;
  DEADLINE: string | null;

  // Nhom Treo Thuong
  TREO_THUONG_SO_TIEN: number | null;
  TREO_THUONG_THOI_HAN: string | null;

  // Nhom Bang Chung
  BANG_CHUNG: any[]; // Mảng các object BangChung

  // Nhom NS Duy Tri
  nhanSuDuyTriIds: string[];
  DUY_TRI_HIEU_LUC: boolean;

  // Quan hệ
  HANG_MUC_REL?: any;
  PHAN_BO_REL?: any;
  NV_PHU_TRACH_REL?: any;
  NV_HO_TRO_REL?: any[];
  LEADER_REL?: any;
  NHAN_SU_DUY_TRI_REL?: any[];
}

export interface Project {
  ID_DU_AN: string;
  NGAY_DU_AN: Date;
  LOAI_DU_AN: { LOAI_DU_AN: string };
  ID_PLHD: string;
  DOI_TAC: string;
  NHOM_DU_AN: { ID_NHOM_DU_AN: string; NHOM_DU_AN: string }[];
  NGAY_DK_BAT_DAU: Date;
  NGAY_DK_HOAN_THANH: Date;
  THUC_TE: string | null;
  DS_DU_AN_CT: any[];
}
