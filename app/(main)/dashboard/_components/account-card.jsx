'use client'
import { updateDefaultAccount } from "@/actions/account";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;
  const {
    loading: updateAccoountLoading,
    fn: updateDefaultfn,
    error,
    data: updatedAccount,
  } = useFetch(updateDefaultAccount);

  const handleDefautChange = async(event)=>{
    event.preventDefault();
    if(isDefault){
        toast.warning("You need atleast 1 default account");
        return;
    }
   await updateDefaultfn(id)
  }
  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="p-4 transition-shadow hover:shadow-lg">
      <Link href={`/account/${id}`} className="block">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <Switch checked={isDefault} onClick={handleDefautChange} disabled={updateAccoountLoading} />
          
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-primary">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Income
          </div>
          <div className="flex items-center text-red-500">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
