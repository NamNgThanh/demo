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

