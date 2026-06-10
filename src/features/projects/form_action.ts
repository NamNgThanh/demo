"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFormsData() {
  try {
    const data = await prisma.nHOM_BM.findMany({
      include: {
        DS_BM: true
      }
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error getting forms:", error);
    return { success: false, error: "Lỗi lấy dữ liệu biểu mẫu" };
  }
}

export async function saveFormRequest(data: {
  ID_DU_AN: string;
  NHOM_BIEU_MAU: string[];
  BIEU_MAU_CAN: string[];
  GHI_CHU?: string;
  LINK?: string;
}) {
  try {
    const result = await prisma.yC_BIEU_MAU.create({
      data: {
        ID_DU_AN: data.ID_DU_AN,
        NHOM_BIEU_MAU: data.NHOM_BIEU_MAU,
        BIEU_MAU_CAN: data.BIEU_MAU_CAN,
        GHI_CHU: data.GHI_CHU,
        LINK: data.LINK
      }
    });
    revalidatePath("/projects");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error saving form request:", error);
    return { success: false, error: "Lỗi lưu dữ liệu" };
  }
}

export async function getFormRequestsByProjectId(projectId: string) {
  try {
    const data = await prisma.yC_BIEU_MAU.findMany({
      where: { ID_DU_AN: projectId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error getting form requests:", error);
    return { success: false, error: "Lỗi lấy dữ liệu" };
  }
}
