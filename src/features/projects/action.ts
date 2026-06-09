"use server";

import { prisma } from "@/lib/prisma";
import { CreateProjectInput, CreateProjectDetailInput, createProjectSchema, createProjectDetailSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { auth } from "@/lib/auth";

const PROJECTS_PATH = "/projects";

// Hàm xử lý ngày (YYMMDD)
function getYYMMDD() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

export const createProject = async (data: CreateProjectInput): Promise<ResultResponse<any>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");

    const validatedData = createProjectSchema.parse(data);

    // 1. Lấy thông tin Đối tác từ Phụ lục hợp đồng
    const plhd = await prisma.pHU_LUC_HOP_DONG.findUnique({
      where: { ID_PLHD: validatedData.ID_PLHD }
    });

    if (!plhd) {
      return createErrorResponse("Không tìm thấy Phụ lục hợp đồng");
    }

    const doiTac = plhd.TEN_DOI_TAC_VIET_TAT;

    // 2. Auto-generate ID (DA_YYMMDD_DOI_TAC_PLHD)
    const yymmdd = getYYMMDD();
    const baseId = `DA_${yymmdd}_${doiTac}_${validatedData.ID_PLHD}`;
    let idDuAn = baseId;

    const existingProjects = await prisma.dS_DU_AN.findMany({
      where: { ID_DU_AN: { startsWith: baseId } },
      select: { ID_DU_AN: true }
    });

    if (existingProjects.length > 0) {
      let maxSuffix = 0;
      let hasExactMatch = false;
      for (const ep of existingProjects) {
        if (ep.ID_DU_AN === baseId) {
          hasExactMatch = true;
        } else {
          const suffixStr = ep.ID_DU_AN.substring(baseId.length + 1); // remove baseId and the underscore
          if (suffixStr && !isNaN(Number(suffixStr))) {
            maxSuffix = Math.max(maxSuffix, Number(suffixStr));
          }
        }
      }
      if (hasExactMatch || maxSuffix > 0) {
        idDuAn = `${baseId}_${maxSuffix + 1}`;
      }
    }

    // 3. Insert vào DB
    const project = await prisma.dS_DU_AN.create({
      data: {
        ID_DU_AN: idDuAn,
        NGAY_DU_AN: new Date(validatedData.NGAY_DU_AN),
        ID_LOAI_DU_AN: validatedData.ID_LOAI_DU_AN,
        ID_PLHD: validatedData.ID_PLHD,
        DOI_TAC: doiTac,
        nhomDuAnIds: validatedData.nhomDuAnIds,
        NGAY_DK_BAT_DAU: new Date(validatedData.NGAY_DK_BAT_DAU),
        NGAY_DK_HOAN_THANH: new Date(validatedData.NGAY_DK_HOAN_THANH),
        THUC_TE: validatedData.THUC_TE || null,
      }
    });

    revalidatePath(PROJECTS_PATH);
    return createSuccessResponse(project);
  } catch (error: any) {
    console.error("Lỗi tạo dự án:", error);
    return createErrorResponse(error.message || "Lỗi khi tạo dự án", error);
  }
}

export const createProjectDetail = async (data: CreateProjectDetailInput): Promise<ResultResponse<any>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");

    const validatedData = createProjectDetailSchema.parse(data);

    // Lấy ID lớn nhất hiện tại để tránh trùng lặp khi có phần tử bị xoá
    const existingDetails = await prisma.dS_DU_AN_CT.findMany({
      where: { ID_DU_AN: validatedData.ID_DU_AN },
      select: { ID_DU_AN_CT: true }
    });
    
    let maxSuffix = 0;
    for (const d of existingDetails) {
      const parts = d.ID_DU_AN_CT.split('_');
      const suffix = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(suffix) && suffix > maxSuffix) {
        maxSuffix = suffix;
      }
    }

    const shortParentId = validatedData.ID_DU_AN.replace(/^DA_\d{6}_/, ""); 
    const idDuAnCt = `CT_${shortParentId}_${maxSuffix + 1}`;

    const projectDetail = await prisma.dS_DU_AN_CT.create({
      data: {
        ID_DU_AN_CT: idDuAnCt,
        ID_DU_AN: validatedData.ID_DU_AN,
        ID_NHOM_DU_AN: validatedData.ID_NHOM_DU_AN,
        TEN_DU_AN_CT: validatedData.TEN_DU_AN_CT,
        ID_HANG_MUC: validatedData.ID_HANG_MUC,
        PHAN_BO_ID: validatedData.PHAN_BO_ID || null,
      }
    });

    revalidatePath(PROJECTS_PATH);
    return createSuccessResponse(projectDetail);
  } catch (error: any) {
    console.error("Lỗi tạo hạng mục dự án:", error);
    return createErrorResponse(error.message || "Lỗi tạo hạng mục", error);
  }
}

export const getProjects = async (): Promise<ResultResponse<any[]>> => {
  try {
    const projects = await prisma.dS_DU_AN.findMany({
      include: {
        LOAI_DU_AN: true,
        NHOM_DU_AN: true,
        PLHD: true,
        DS_DU_AN_CT: {
          include: {
            HANG_MUC_REL: true,
            PHAN_BO_REL: { select: { HO_VA_TEN: true, EMAIL: true } },
            NV_PHU_TRACH_REL: { select: { ID_NHAN_VIEN: true, HO_VA_TEN: true, EMAIL: true } },
            NV_HO_TRO_REL: { select: { ID_NHAN_VIEN: true, HO_VA_TEN: true, EMAIL: true } },
            LEADER_REL: { select: { ID_NHAN_VIEN: true, HO_VA_TEN: true, EMAIL: true } },
            NHAN_SU_DUY_TRI_REL: { select: { ID_NHAN_VIEN: true, HO_VA_TEN: true, EMAIL: true } }
          }
        }
      },
      orderBy: {
        NGAY_DU_AN: 'desc'
      }
    });

    // Tính toán các trường ảo
    const currentDate = new Date();

    const computedProjects = projects.map(project => {
      
      const computedDetails = project.DS_DU_AN_CT.map(detail => {
        // Cột ảo: TINH_TRANG
        let tinhTrang = "Đang triển khai";
        if (!detail.PHAN_BO_ID && !detail.NV_PHU_TRACH_ID) {
          tinhTrang = "Chưa phân bổ";
        } else if (currentDate < project.NGAY_DK_BAT_DAU) {
          tinhTrang = "Chưa triển khai";
        } else if (currentDate > project.NGAY_DK_HOAN_THANH) {
          tinhTrang = "Quá hạn";
        }

        // Cột hiển thị UI (Tính toán từ các trường thật)
        const phanBoStr = detail.NV_PHU_TRACH_REL?.HO_VA_TEN || detail.PHAN_BO_REL?.HO_VA_TEN || "Chưa phân bổ";
        const thucTe = "";

        return {
          ...detail,
          TINH_TRANG: tinhTrang,
          PHAN_BO: phanBoStr,
          THUC_TE: thucTe,
          DEADLINE: detail.DEADLINE 
            ? new Date(detail.DEADLINE).toISOString().split('T')[0]
            : (project.NGAY_DK_HOAN_THANH ? new Date(project.NGAY_DK_HOAN_THANH).toISOString().split('T')[0] : ""),
          TREO_THUONG_SO_TIEN: detail.TREO_THUONG_SO_TIEN || 0,
          TREO_THUONG_THOI_HAN: detail.TREO_THUONG_THOI_HAN 
            ? new Date(detail.TREO_THUONG_THOI_HAN).toISOString().split('T')[0]
            : "",
        };
      });

      return {
        ...project,
        DS_DU_AN_CT: computedDetails
      };
    });

    return createSuccessResponse(computedProjects);
  } catch (error: any) {
    console.error("Lỗi lấy danh sách dự án:", error);
    return createErrorResponse("Lỗi lấy danh sách dự án", error);
  }
}

export const getProjectFormOptions = async (): Promise<ResultResponse<any>> => {
  try {
    const [loaiDuAn, nhomDuAn, plhd] = await Promise.all([
      prisma.lOAI_DU_AN.findMany({ where: { HIEU_LUC: true } }),
      prisma.nHOM_DU_AN.findMany({ where: { HIEU_LUC: true } }),
      prisma.pHU_LUC_HOP_DONG.findMany({ where: { HIEU_LUC: true } })
    ]);

    return createSuccessResponse({
      loaiDuAn,
      nhomDuAn,
      plhd
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh mục form dự án:", error);
    return createErrorResponse("Lỗi lấy danh mục", error);
  }
}

export const getProjectDetailFormOptions = async (): Promise<ResultResponse<any>> => {
  try {
    const [hangMuc, nhanVien] = await Promise.all([
      prisma.dS_HANG_MUC.findMany({ where: { HIEU_LUC: true }, orderBy: { TEN_HANG_MUC: 'asc' } }),
      prisma.nHAN_VIEN.findMany({ where: { TRANG_THAI: 'DANG_LAM_VIEC' }, orderBy: { HO_VA_TEN: 'asc' } })
    ]);

    return createSuccessResponse({
      hangMuc,
      nhanVien
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh mục form chi tiết dự án:", error);
    return createErrorResponse("Lỗi lấy danh mục chi tiết", error);
  }
}

export const updateProjectDetailInfo = async (data: any): Promise<ResultResponse<any>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");

    // Parse specific fields if needed
    const {
      ID_DU_AN_CT,
      EMAIL_SO_HUU,
      NV_PHU_TRACH_ID,
      nvHoTroIds,
      LEADER_ID,
      DEADLINE,
      TREO_THUONG_SO_TIEN,
      TREO_THUONG_THOI_HAN,
      BANG_CHUNG,
      nhanSuDuyTriIds,
      DUY_TRI_HIEU_LUC
    } = data;

    const updatedDetail = await prisma.dS_DU_AN_CT.update({
      where: { ID_DU_AN_CT },
      data: {
        EMAIL_SO_HUU,
        NV_PHU_TRACH_ID: NV_PHU_TRACH_ID || null,
        nvHoTroIds: nvHoTroIds || [],
        LEADER_ID: LEADER_ID || null,
        DEADLINE: DEADLINE ? new Date(DEADLINE) : null,
        TREO_THUONG_SO_TIEN: TREO_THUONG_SO_TIEN || null,
        TREO_THUONG_THOI_HAN: TREO_THUONG_THOI_HAN ? new Date(TREO_THUONG_THOI_HAN) : null,
        BANG_CHUNG: BANG_CHUNG || [],
        nhanSuDuyTriIds: nhanSuDuyTriIds || [],
        DUY_TRI_HIEU_LUC: DUY_TRI_HIEU_LUC !== undefined ? DUY_TRI_HIEU_LUC : true,
      }
    });

    revalidatePath(PROJECTS_PATH);
    return createSuccessResponse(updatedDetail);
  } catch (error: any) {
    console.error("Lỗi cập nhật chi tiết dự án:", error);
    return createErrorResponse(error.message || "Lỗi cập nhật hạng mục", error);
  }
}

export const deleteProjectDetail = async (id: string): Promise<ResultResponse<any>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");

    await prisma.dS_DU_AN_CT.delete({
      where: { ID_DU_AN_CT: id }
    });

    revalidatePath(PROJECTS_PATH);
    return createSuccessResponse({ id });
  } catch (error: any) {
    console.error("Lỗi xoá chi tiết dự án:", error);
    return createErrorResponse(error.message || "Lỗi xoá hạng mục", error);
  }
}

export const deleteProject = async (id: string): Promise<ResultResponse<any>> => {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return createErrorResponse("Bạn không có quyền thực hiện chức năng này.");

    await prisma.$transaction([
      prisma.dS_DU_AN_CT.deleteMany({ where: { ID_DU_AN: id } }),
      prisma.dS_DU_AN.delete({ where: { ID_DU_AN: id } })
    ]);

    revalidatePath(PROJECTS_PATH);
    return createSuccessResponse({ id });
  } catch (error: any) {
    console.error("Lỗi xoá dự án:", error);
    return createErrorResponse(error.message || "Lỗi xoá dự án", error);
  }
}
