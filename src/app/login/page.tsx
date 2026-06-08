import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex animate-in fade-in duration-500">
      <div className="hidden lg:flex lg:w-3/5 relative bg-linear-to-br from-amber-500 to-amber-800 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }} />
        </div>

        <div className="absolute inset-0 bg-linear-to-tr from-blue-900/50 to-transparent pointer-events-none" />

        <div className="relative z-10 W-max px-12 space-y-12 animate-in slide-in-from-right-8 duration-1000 flex flex-col items-center">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center justify-center rounded-full border border-blue-400/10 bg-blue-500/10 px-3 py-1 text-sm text-blue-100 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
              Enterprise Edition 2.0
            </div>

            <h2 className="text-5xl text-center font-bold text-white leading-tight tracking-tight drop-shadow-sm">
              Hệ thống Quản lý
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-blue-200">
                HÀNH CHÍNH NHÂN SỰ
              </span>
            </h2>
            <p className="text-xl text-center text-blue-100/90 leading-relaxed max-w-lg">
              Giải pháp toàn diện giúp doanh nghiệp tối ưu hóa quy trình nhân sự,
              nâng cao hiệu suất và xây dựng văn hóa làm việc hiện đại.
            </p>
          </div>

          <div className="flex gap-4 justify-center content-center">
            <div className="flex items-center gap-2 text-white/90 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Tuyển dụng</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Quản lý Hồ sơ</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Chấm công</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Tính lương</span>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/logo.png"
              alt="WOWS HCNS Logo"
              className="h-16 w-auto"
            />
            <Link
              href="/"
              className="font-bold tracking-tight text-3xl text-slate-900"
            >
              WOWS <span className="text-amber-600">HCNS</span>
            </Link>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Chào mừng trở lại
            </h1>
            <p className="text-slate-600">
              Đăng nhập để truy cập hệ thống quản lý hành chính nhân sự
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} WOWS HCNS.</p>
          </div>
        </div>
      </div>
    </div>
  )
};