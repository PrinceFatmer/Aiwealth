"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Switch } from "./ui/switch";
import useFetch from "@/hooks/use-fetch";
import { CreateAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });
  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(CreateAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };
  useEffect(()=>{
  if(newAccount && !createAccountLoading)
  {
    toast.success("Account Creayted Successfully")
    reset()
    setOpen(false)
  }
  },[createAccountLoading, newAccount]
)
useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-6 rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">Create New Account</DrawerTitle>
          <DrawerDescription className="text-sm text-gray-500">
            Fill in the details below to create a new account.
          </DrawerDescription>
        </DrawerHeader>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Account Name
              </label>
              <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium">
                Account Type
              </label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
            <div>
              <label htmlFor="balance" className="block text-sm font-medium">
                Initial Balance
              </label>
              <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("balance")} />
              {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div>
                <label htmlFor="isDefault" className="text-sm font-medium">
                  Set as Default
                </label>
                <p className="text-xs text-gray-500">This account will be selected by default for transactions.</p>
              </div>
              <Switch id="isDefault" checked={watch("isDefault")} onCheckedChange={(checked) => setValue("isDefault", checked)} />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="px-4 py-2">Cancel</Button>
            </DrawerClose>
            <Button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            disabled={createAccountLoading}>
              {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
