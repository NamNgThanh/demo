"use client";

import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeFormData } from "../schema";
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, Sparkles, User } from "lucide-react";

interface EmployeeAccountFieldsProps {
  form: UseFormReturn<EmployeeFormData>;
  isDisabled?: boolean;
}

export function EmployeeAccountFields({ form, isDisabled }: EmployeeAccountFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const taoTaiKhoan = useWatch({
    control: form.control,
    name: "TAO_TAI_KHOAN",
  });
  
  const maNv = useWatch({
    control: form.control,
    name: "MA_NV",
  });

  const suggestUsername = () => {
    if (!maNv) return;
    const suggested = maNv.toLowerCase().replace(/[^a-z0-9._-]/g, "");
    form.setValue("USER_NAME", suggested, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-4 flex gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-amber-900">Tài khoản đăng nhập hệ thống</p>
          <p className="text-amber-800/90 leading-relaxed">
            Bật tùy chọn bên dưới nếu nhân viên cần truy cập phần mềm. Mật khẩu được mã hóa trước khi lưu và
            không hiển thị lại sau khi tạo.
          </p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="TAO_TAI_KHOAN"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  const enabled = checked === true;
                  field.onChange(enabled);
                  if (!enabled) {
                    form.setValue("USER_NAME", "");
                    form.setValue("PASSWORD", "");
                    form.setValue("XAC_NHAN_MAT_KHAU", "");
                    form.clearErrors(["USER_NAME", "PASSWORD", "XAC_NHAN_MAT_KHAU"]);
                  }
                }}
                disabled={isDisabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base font-medium cursor-pointer">
                Cấp tài khoản đăng nhập cho nhân viên
              </FormLabel>
              <FormDescription>
                Khi tắt, nhân viên chỉ có hồ sơ nhân sự, không có quyền đăng nhập.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {taoTaiKhoan && (
        <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FormField
            control={form.control}
            name="USER_NAME"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên đăng nhập <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="vd: nv001 hoặc ten.dang.nhap"
                        className="pl-9"
                        autoComplete="off"
                        disabled={isDisabled}
                      />
                    </div>
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={suggestUsername}
                    disabled={isDisabled || !maNv}
                  >
                    <Sparkles className="h-4 w-4" />
                    Gợi ý
                  </Button>
                </div>
                <FormDescription>Dùng chữ thường, số, dấu chấm hoặc gạch dưới (3–32 ký tự).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="PASSWORD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật khẩu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 6 ký tự"
                        className="pl-9 pr-10"
                        autoComplete="new-password"
                        disabled={isDisabled}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="XAC_NHAN_MAT_KHAU"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Xác nhận mật khẩu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        className="pl-9 pr-10"
                        autoComplete="new-password"
                        disabled={isDisabled}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
