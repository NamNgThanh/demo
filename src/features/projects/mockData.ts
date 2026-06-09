import { Project } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    ID_DU_AN: "DA_2023_001",
    NGAY_DU_AN: "2023-10-01",
    LOAI_DU_AN: "Dự án CNTT",
    ID_PLHD: "PLHD_001",
    DOI_TAC: "Công ty ABC",
    NHOM_DU_AN: "Nhóm Phát triển",
    NGAY_DK_BAT_DAU: "2023-10-15",
    NGAY_DK_HOAN_THANH: "2024-03-15",
    THUC_TE: 80,
    TINH_TRANG: "Đang triển khai",
    DS_DU_AN_CT: [
      {
        ID_DU_AN_CT: "CT_001_1",
        ID_DU_AN: "DA_2023_001",
        NHOM_DU_AN: "Frontend",
        TEN_DU_AN_CT: "Thiết kế UI/UX & Code Frontend",
        DS_HANG_MUC: "Giao diện, Component, API Client",
        TY_TRONG: 40,
        PHAN_BO: 2,
        DEADLINE: "2023-12-01",
        TREO_THUONG: 10000000,
        THUC_TE: 95,
        BANG_CHUNG: "Link Figma, Github Repo",
        TINH_TRANG: "Gần hoàn thành"
      },
      {
        ID_DU_AN_CT: "CT_001_2",
        ID_DU_AN: "DA_2023_001",
        NHOM_DU_AN: "Backend",
        TEN_DU_AN_CT: "Xây dựng Database & API Services",
        DS_HANG_MUC: "Schema, REST API, Auth",
        TY_TRONG: 60,
        PHAN_BO: 3,
        DEADLINE: "2024-02-15",
        TREO_THUONG: 15000000,
        THUC_TE: 70,
        BANG_CHUNG: "Link API Docs",
        TINH_TRANG: "Đang triển khai"
      }
    ]
  },
  {
    ID_DU_AN: "DA_2024_002",
    NGAY_DU_AN: "2024-01-10",
    LOAI_DU_AN: "Marketing",
    ID_PLHD: "PLHD_002",
    DOI_TAC: "Agency XYZ",
    NHOM_DU_AN: "Nhóm Truyền thông",
    NGAY_DK_BAT_DAU: "2024-02-01",
    NGAY_DK_HOAN_THANH: "2024-05-01",
    THUC_TE: 10,
    TINH_TRANG: "Mới khởi tạo",
    DS_DU_AN_CT: [
      {
        ID_DU_AN_CT: "CT_002_1",
        ID_DU_AN: "DA_2024_002",
        NHOM_DU_AN: "Content",
        TEN_DU_AN_CT: "Viết bài PR & Chuẩn bị kịch bản",
        DS_HANG_MUC: "10 bài báo, 2 video kịch bản",
        TY_TRONG: 30,
        PHAN_BO: 2,
        DEADLINE: "2024-03-01",
        TREO_THUONG: 5000000,
        THUC_TE: 30,
        BANG_CHUNG: "Google Drive Folder",
        TINH_TRANG: "Đang tiến hành"
      }
    ]
  }
];
