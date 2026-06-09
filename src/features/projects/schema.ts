import * as z from "zod";

export const createProjectSchema = z.object({
  NGAY_DU_AN: z.string().or(z.date()),
  ID_LOAI_DU_AN: z.string().min(1, "Vui lòng chọn Loại dự án"),
  ID_PLHD: z.string().min(1, "Vui lòng chọn Phụ lục hợp đồng"),
  nhomDuAnIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 nhóm dự án"),
  NGAY_DK_BAT_DAU: z.string().or(z.date()),
  NGAY_DK_HOAN_THANH: z.string().or(z.date()),
  THUC_TE: z.string().optional(),
});

export const createProjectDetailSchema = z.object({
  ID_DU_AN: z.string().min(1, "Thiếu ID dự án"),
  ID_NHOM_DU_AN: z.string().min(1, "Vui lòng chọn Nhóm dự án"),
  TEN_DU_AN_CT: z.string().min(1, "Vui lòng nhập tên dự án chi tiết"),
  ID_HANG_MUC: z.string().min(1, "Vui lòng chọn Hạng mục"),
  PHAN_BO_ID: z.string().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateProjectDetailInput = z.infer<typeof createProjectDetailSchema>;

export const updateProjectDetailSchema = z.object({
  ID_DU_AN_CT: z.string(),
  EMAIL_SO_HUU: z.string().nullable().optional(),
  NV_PHU_TRACH_ID: z.string().nullable().optional(),
  nvHoTroIds: z.array(z.string()).optional(),
  LEADER_ID: z.string().nullable().optional(),
  DEADLINE: z.string().nullable().optional(),
  TINH_TRANG: z.string().optional(),
  TREO_THUONG_SO_TIEN: z.number().nullable().optional(),
  TREO_THUONG_THOI_HAN: z.string().nullable().optional(),
  BANG_CHUNG: z.array(z.any()).optional(),
  nhanSuDuyTriIds: z.array(z.string()).optional(),
  DUY_TRI_HIEU_LUC: z.boolean().optional(),
});

export type UpdateProjectDetailInput = z.infer<typeof updateProjectDetailSchema>;
