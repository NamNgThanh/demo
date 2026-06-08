import z from "zod";

const usernameRegex = /^[a-z0-9._-]{3,32}$/;

const accountFieldsSchema = z.object({
  TAO_TAI_KHOAN: z.boolean(),
  USER_NAME: z.string().optional(),
  PASSWORD: z.string().optional(),
  XAC_NHAN_MAT_KHAU: z.string().optional(),
});

export const baseNhanVienSchema = z
  .object({
    MA_NV: z.string(),
    HO_VA_TEN: z
      .string({ message: "Họ và tên không hợp lệ" })
      .min(1, "Họ và tên không được để trống")
      .max(255, "Họ và tên không được vượt quá 255 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"),
    GIOI_TINH: z.enum(["NAM", "NU", "KHAC"], { message: "Giới tính không hợp lệ" }),
    NGAY_SINH: z.date({ message: "Vui lòng nhập ngày sinh" }),
    SO_DIEN_THOAI: z
      .string({ message: "Số điện thoại không hợp lệ" })
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
      .min(1, "Vui lòng nhập số điện thoại"),
    EMAIL: z.email({ message: "Email không hợp lệ" }).min(1, "Vui lòng nhập email"),
    DIA_CHI_THUONG_TRU: z
      .string({ message: "Địa chỉ thường trú không hợp lệ" })
      .min(1, "Địa chỉ thường trú không được để trống")
      .max(255, "Địa chỉ thường trú không được vượt quá 255 ký tự"),
    DIA_CHI_HIEN_TAI: z
      .string({ message: "Địa chỉ hiện tại không hợp lệ" })
      .min(1, "Địa chỉ hiện tại không được để trống")
      .max(255, "Địa chỉ hiện tại không được vượt quá 255 ký tự"),
    SO_CCCD: z
      .string({ message: "Số CCCD không hợp lệ" })
      .regex(/^[0-9]{12}$/, "Số CCCD phải có 12 chữ số")
      .min(1, "Vui lòng nhập số CCCD"),
    NGAY_CAP_CCCD: z.date({ message: "Vui lòng nhập ngày cấp CCCD" }),
    NOI_CAP_CCCD: z
      .string({ message: "Nơi cấp CCCD không hợp lệ" })
      .min(1, "Nơi cấp CCCD không được để trống")
      .max(255, "Nơi cấp CCCD không được vượt quá 255 ký tự"),
    NGAY_HET_HAN_CCCD: z.date({ message: "Vui lòng nhập ngày hết hạn CCCD" }),
    NGAY_NHAN_VIEC: z.date({ message: "Vui lòng nhập ngày nhận việc" }),
    TRANG_THAI: z.enum(["DANG_LAM_VIEC", "THU_VIEC", "NGHI_VIEC"], {
      message: "Trạng thái làm việc không hợp lệ",
    }),
    HINH_THUC: z.enum(["TOAN_THOI_GIAN", "BAN_THOI_GIAN", "THU_VIEC"], {
      message: "Loại nhân viên không hợp lệ",
    }),
    CHUC_VU: z.string().min(1, "Vui lòng chọn hoặc nhập chức vụ"),
    PHONGBAN: z.string().min(1, "Vui lòng chọn hoặc nhập phòng ban"),
  })
export const createNhanVienSchema = baseNhanVienSchema
  .merge(accountFieldsSchema)
  .superRefine((data, ctx) => {
    if (!data.TAO_TAI_KHOAN) return;

    const username = data.USER_NAME?.trim().toLowerCase() ?? "";
    if (!username) {
      ctx.addIssue({
        code: "custom",
        path: ["USER_NAME"],
        message: "Vui lòng nhập tên đăng nhập",
      });
    } else if (!usernameRegex.test(username)) {
      ctx.addIssue({
        code: "custom",
        path: ["USER_NAME"],
        message: "Tên đăng nhập không hợp lệ (3–32 ký tự, chữ thường, số, . _ -)",
      });
    }

    if (!data.PASSWORD || data.PASSWORD.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["PASSWORD"],
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    if (data.PASSWORD !== data.XAC_NHAN_MAT_KHAU) {
      ctx.addIssue({
        code: "custom",
        path: ["XAC_NHAN_MAT_KHAU"],
        message: "Mật khẩu xác nhận không khớp",
      });
    }
  });

export const updateNhanVienSchema = baseNhanVienSchema;

export type EmployeeFormData = z.infer<typeof createNhanVienSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateNhanVienSchema>;
