import { TRANG_THAI_LAM_VIEC, HINH_THUC_LAM_VIEC, GIOI_TINH } from "@prisma/client";
export const TRANG_THAI_LAM_VIEC_LABELS: Record<TRANG_THAI_LAM_VIEC, string> = {
  DANG_LAM_VIEC: "Đang làm việc",
  THU_VIEC: "Thử việc",
  NGHI_VIEC: "Nghỉ việc",
};

export const HINH_THUC_LAM_VIEC_LABELS: Record<HINH_THUC_LAM_VIEC, string> = {
  TOAN_THOI_GIAN: "Toàn thời gian",
  BAN_THOI_GIAN: "Bán thời gian",
  THU_VIEC: "Thử việc",
};

export const GIOI_TINH_LABELS: Record<GIOI_TINH, string> = {
  NAM: "Nam",
  NU: "Nữ",
  KHAC: "Khác",
};
