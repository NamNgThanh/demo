"use server";

import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/types/response";
import { revalidatePath } from "next/cache";

export async function getDanhMucChucVu() {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.findMany({
      orderBy: { TEN_CV: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục chức vụ", error);
  }
}

export async function addDanhMucChucVu(idCv: string, tenCv: string) {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.create({
      data: { ID_CV: idCv.trim().toUpperCase(), TEN_CV: tenCv.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm (Mã hoặc tên chức vụ đã tồn tại)", error);
  }
}

export async function toggleDanhMucChucVu(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.update({
      where: { ID_CV: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái chức vụ", error);
  }
}

export async function deleteDanhMucChucVu(id: string) {
  try {
    await prisma.dANH_MUC_CHUC_VU.delete({
      where: { ID_CV: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục chức vụ", error);
  }
}

// Phòng ban
export async function getDanhMucPhongBan() {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.findMany({
      orderBy: { TEN_PB: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục phòng ban", error);
  }
}

export async function addDanhMucPhongBan(idPb: string, tenPb: string) {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.create({
      data: { ID_PB: idPb.trim().toUpperCase(), TEN_PB: tenPb.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm (Mã hoặc tên phòng ban đã tồn tại)", error);
  }
}

export async function toggleDanhMucPhongBan(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.update({
      where: { ID_PB: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái phòng ban", error);
  }
}

export async function deleteDanhMucPhongBan(id: string) {
  try {
    await prisma.dANH_MUC_PHONG_BAN.delete({
      where: { ID_PB: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục phòng ban", error);
  }
}

// Loại dự án
export async function getDanhMucLoaiDuAn() {
  try {
    const data = await prisma.lOAI_DU_AN.findMany({
      orderBy: { LOAI_DU_AN: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục Loại dự án", error);
  }
}

export async function addDanhMucLoaiDuAn(id: string, ten: string) {
  try {
    const data = await prisma.lOAI_DU_AN.create({
      data: { ID_LOAI_DU_AN: id.trim().toUpperCase(), LOAI_DU_AN: ten.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm (Mã hoặc tên đã tồn tại)", error);
  }
}

export async function toggleDanhMucLoaiDuAn(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.lOAI_DU_AN.update({
      where: { ID_LOAI_DU_AN: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái", error);
  }
}

export async function deleteDanhMucLoaiDuAn(id: string) {
  try {
    await prisma.lOAI_DU_AN.delete({
      where: { ID_LOAI_DU_AN: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục Loại dự án", error);
  }
}

// Nhóm dự án
export async function getDanhMucNhomDuAn() {
  try {
    const data = await prisma.nHOM_DU_AN.findMany({
      include: {
        LOAI_DU_AN_REL: true
      },
      orderBy: { NHOM_DU_AN: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục Nhóm dự án", error);
  }
}

export async function addDanhMucNhomDuAn(id: string, ten: string, idLoai: string) {
  try {
    const data = await prisma.nHOM_DU_AN.create({
      data: { ID_NHOM_DU_AN: id.trim().toUpperCase(), NHOM_DU_AN: ten.trim(), ID_LOAI_DU_AN: idLoai }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm (Mã hoặc tên đã tồn tại)", error);
  }
}

export async function toggleDanhMucNhomDuAn(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.nHOM_DU_AN.update({
      where: { ID_NHOM_DU_AN: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái", error);
  }
}

export async function deleteDanhMucNhomDuAn(id: string) {
  try {
    await prisma.nHOM_DU_AN.delete({
      where: { ID_NHOM_DU_AN: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục Nhóm dự án", error);
  }
}

// Phụ lục hợp đồng
export async function getDanhMucPhuLucHopDong() {
  try {
    const data = await prisma.pHU_LUC_HOP_DONG.findMany({
      orderBy: { ID_PLHD: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục Phụ lục hợp đồng", error);
  }
}

export async function addDanhMucPhuLucHopDong(id: string, tenDoiTac: string) {
  try {
    const data = await prisma.pHU_LUC_HOP_DONG.create({
      data: { ID_PLHD: id.trim().toUpperCase(), TEN_DOI_TAC_VIET_TAT: tenDoiTac.trim().toUpperCase() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm (Mã đã tồn tại)", error);
  }
}

export async function toggleDanhMucPhuLucHopDong(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.pHU_LUC_HOP_DONG.update({
      where: { ID_PLHD: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái", error);
  }
}

export async function deleteDanhMucPhuLucHopDong(id: string) {
  try {
    await prisma.pHU_LUC_HOP_DONG.delete({
      where: { ID_PLHD: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục Phụ lục hợp đồng", error);
  }
}

// Danh mục hạng mục
export async function getDanhMucHangMuc() {
  try {
    const data = await prisma.dS_HANG_MUC.findMany({
      orderBy: { TEN_HANG_MUC: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục Hạng mục", error);
  }
}

export async function addDanhMucHangMuc(ten: string) {
  try {
    const data = await prisma.dS_HANG_MUC.create({
      data: { TEN_HANG_MUC: ten.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm hạng mục", error);
  }
}

export async function toggleDanhMucHangMuc(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.dS_HANG_MUC.update({
      where: { ID_HANG_MUC: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái", error);
  }
}

export async function deleteDanhMucHangMuc(id: string) {
  try {
    await prisma.dS_HANG_MUC.delete({
      where: { ID_HANG_MUC: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục", error);
  }
}

