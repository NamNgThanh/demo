"use server"

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { Prisma } from "@prisma/client";
import { EmployeeFormData, UpdateEmployeeFormData } from "./schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const EMPLOYEES_PATH = "/employees";

const employeeInclude = {
  NGUOI_DUNG: {
    select: { TAI_KHOAN: true }
  }
};

export type EmployeePublic = Prisma.NHAN_VIENGetPayload<{
  include: typeof employeeInclude;
}>;

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

async function buildCreatePayload(employeeData: EmployeeFormData) {
  const { NGAY_NHAN_VIEC, PASSWORD, XAC_NHAN_MAT_KHAU, TAO_TAI_KHOAN, USER_NAME, ...data } =
    employeeData;

  const payload: Prisma.NHAN_VIENCreateInput = {
    ...data,
    NGAY_SINH: toDate(data.NGAY_SINH),
    NGAY_CAP_CCCD: toDate(data.NGAY_CAP_CCCD),
    NGAY_HET_HAN_CCCD: toDate(data.NGAY_HET_HAN_CCCD),
    NGAY_CHINH_THUC:
      employeeData.TRANG_THAI === "DANG_LAM_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
    NGAY_THU_VIEC: employeeData.TRANG_THAI === "THU_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
  };

  return payload;
}

export async function getNextEmployeeCode() {
  const lastEmployee = await prisma.nHAN_VIEN.findFirst({
    orderBy: { MA_NV: "desc" },
    select: { MA_NV: true },
  });

  if (!lastEmployee || !lastEmployee.MA_NV) {
    return "NV001";
  }

  // Lấy ra phần số (ví dụ NV005 -> 5) và cộng thêm 1
  const lastNumberStr = lastEmployee.MA_NV.replace(/\D/g, "");
  const nextNumber = parseInt(lastNumberStr || "0", 10) + 1;

  return `NV${String(nextNumber).padStart(3, "0")}`;
}

export const getAllEmployees = async (): Promise<ResultResponse<EmployeePublic[]>> => {
  try {
    const employees = await prisma.nHAN_VIEN.findMany({
      orderBy: {
        MA_NV: "desc",
      },
      include: employeeInclude,
    });

    return createSuccessResponse(employees);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách nhân viên", error);
  }
};

export const getEmployees = getAllEmployees;

export const getEmployeeById = async (id: string): Promise<ResultResponse<EmployeePublic>> => {
  try {
    const employee = await prisma.nHAN_VIEN.findUnique({
      where: {
        MA_NV: id,
      },
      include: employeeInclude,
    });

    if (!employee) {
      return createErrorResponse("Không tìm thấy nhân viên với ID này", null);
    }

    return createSuccessResponse(employee);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy thông tin nhân viên", error);
  }
};

export const createEmployee = async (
  employeeData: EmployeeFormData
): Promise<ResultResponse<EmployeePublic>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");
    const payload = await buildCreatePayload(employeeData);

    const { TAO_TAI_KHOAN, USER_NAME, PASSWORD } = employeeData;
    let nguoiDungId = undefined;

    if (TAO_TAI_KHOAN && USER_NAME?.trim() && PASSWORD) {
      const username = USER_NAME.trim().toLowerCase();
      const existingUser = await prisma.nGUOI_DUNG.findUnique({
        where: { TAI_KHOAN: username }
      });

      if (existingUser) {
        return createErrorResponse("Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.");
      }

      const hashedPassword = await bcrypt.hash(PASSWORD, 10);
      const newUser = await prisma.nGUOI_DUNG.create({
        data: {
          TAI_KHOAN: username,
          MAT_KHAU: hashedPassword,
          QUYEN: "USER"
        }
      });
      nguoiDungId = newUser.ID_NGUOI_DUNG;
    }

    if (nguoiDungId) {
      payload.NGUOI_DUNG = {
        connect: { ID_NGUOI_DUNG: nguoiDungId }
      };
    }

    const newEmployee = await prisma.nHAN_VIEN.create({
      data: payload,
      include: employeeInclude,
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(newEmployee);
  } catch (error) {
    console.error("createEmployee failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return createErrorResponse("Tên đăng nhập đã bị trùng. Vui lòng thử lại.", error);
    }

    return createErrorResponse("Lỗi khi tạo nhân viên mới", error);
  }
};

export const updateEmployee = async (
  id: string,
  employeeData: UpdateEmployeeFormData
): Promise<ResultResponse<EmployeePublic>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");
    const { NGAY_NHAN_VIEC, ...data } = employeeData;

    const payload = {
      ...data,
      NGAY_SINH: toDate(data.NGAY_SINH),
      NGAY_CAP_CCCD: toDate(data.NGAY_CAP_CCCD),
      NGAY_HET_HAN_CCCD: toDate(data.NGAY_HET_HAN_CCCD),
      NGAY_CHINH_THUC:
        employeeData.TRANG_THAI === "DANG_LAM_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
      NGAY_THU_VIEC: employeeData.TRANG_THAI === "THU_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
    };

    const updatedEmployee = await prisma.nHAN_VIEN.update({
      where: { MA_NV: id },
      data: payload,
      include: employeeInclude,
    });
    
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(updatedEmployee);
  } catch (error) {
    console.error("updateEmployee failed:", error);
    return createErrorResponse("Lỗi khi cập nhật thông tin nhân viên", error);
  }
};

export const deleteEmployee = async (id: string): Promise<ResultResponse<null>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");
    await prisma.nHAN_VIEN.delete({
      where: {
        MA_NV: id,
      },
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xóa nhân viên", error);
  }
};

export const terminateEmployee = async (id: string): Promise<ResultResponse<null>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");
    await prisma.nHAN_VIEN.update({
      where: {
        MA_NV: id,
      },
      data: {
        TRANG_THAI: "NGHI_VIEC",
      }
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái nhân viên", error);
  }
};

export const getEmployeeFormOptions = async () => {
  try {
    const [chucVuList, phongBanList] = await Promise.all([
      prisma.dANH_MUC_CHUC_VU.findMany({
        where: { HIEU_LUC: true },
        select: { ID_CV: true, TEN_CV: true },
        orderBy: { TEN_CV: 'asc' }
      }),
      prisma.dANH_MUC_PHONG_BAN.findMany({
        where: { HIEU_LUC: true },
        select: { ID_PB: true, TEN_PB: true },
        orderBy: { TEN_PB: 'asc' }
      })
    ]);

    return createSuccessResponse({
      chucVuOptions: chucVuList.map(item => ({ value: item.TEN_CV, label: item.TEN_CV })),
      phongBanOptions: phongBanList.map(item => ({ value: item.TEN_PB, label: item.TEN_PB }))
    });
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục form nhân viên", error);
  }
};
