import { getAccountWithTransactions } from "@/actions/account";
import "../../../../components/hersection.css";
import React, { Suspense } from "react";
// import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";
import Transaction from "../_components/transaction-table";

const AccountsPage = async ({ params }) => {
  const { id } = await params; // No need to await
  const accountData = await getAccountWithTransactions(id); // Await if it's an async function

  if (!accountData) {
    console.log("Unable to find account");
    return <div>Account not found</div>;
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5 mt-20">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>
      {/* Chart Section */}

      {/* Transaction table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <Transaction transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountsPage;
