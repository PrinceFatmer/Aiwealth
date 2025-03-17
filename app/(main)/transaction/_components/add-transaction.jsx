"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";

import CreateAccountDrawer from "@/components/createAccountDrawer";
import { ReceiptScanner } from "./recipt-scanner";

export default function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts?.find((ac) => ac.isDefault)?.id || "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(initialData.id, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode, router, reset]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories?.filter(
    (category) => category.type === type
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-xl border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Receipt Scanner */}
        {!editMode && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        )}

        {/* Type */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide">
            Transaction Type
          </label>
          <Select
            onValueChange={(value) => setValue("type", value)}
            defaultValue={type}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-md">
              <SelectItem value="EXPENSE" className="hover:bg-indigo-50">
                Expense
              </SelectItem>
              <SelectItem value="INCOME" className="hover:bg-indigo-50">
                Income
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600 font-medium">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Amount and Account */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 font-medium">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              Account
            </label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto">
                {accounts?.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id}
                    className="hover:bg-indigo-50"
                  >
                    {account.name} (${parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="w-full text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                  >
                    + Create New Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-600 font-medium">
                {errors.accountId.message}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide">
            Category
          </label>
          <Select
            onValueChange={(value) => setValue("category", value)}
            defaultValue={getValues("category")}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto">
              {filteredCategories?.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="hover:bg-indigo-50"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 font-medium">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all",
                  !date && "text-gray-500"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gray-200 shadow-lg rounded-md">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="rounded-md border-0"
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-600 font-medium">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide">
            Description
          </label>
          <Input
            placeholder="Enter a description"
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-600 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Recurring Toggle */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-1">
            <label className="text-base font-semibold text-gray-700 tracking-wide">
              Recurring Transaction
            </label>
            <p className="text-sm text-gray-500">
              Enable recurring schedule
            </p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
            className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-300"
          />
        </div>

        {/* Recurring Interval */}
        {isRecurring && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              Recurring Interval
            </label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-md">
                <SelectItem value="DAILY" className="hover:bg-indigo-50">
                  Daily
                </SelectItem>
                <SelectItem value="WEEKLY" className="hover:bg-indigo-50">
                  Weekly
                </SelectItem>
                <SelectItem value="MONTHLY" className="hover:bg-indigo-50">
                  Monthly
                </SelectItem>
                <SelectItem value="YEARLY" className="hover:bg-indigo-50">
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-red-600 font-medium">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 rounded-md shadow-sm transition-all max-w-[48%]"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed max-w-[48%]"
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "Update Transaction"
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}