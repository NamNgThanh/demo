export type GIOI_TINH = "NAM" | "NU" | "KHAC";

export interface NHAN_VIEN {
  ID_NHAN_VIEN: string;
  MA_NV: string;
  HO_VA_TEN: string;
  GIOI_TINH: GIOI_TINH;
  NGAY_SINH: Date;
  DIA_CHI_THUONG_TRU: string;
  DIA_CHI_HIEN_TAI: string;
  SO_DIEN_THOAI: string;
  EMAIL: string;
}
