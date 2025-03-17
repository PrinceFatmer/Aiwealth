import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";

import { getTransaction } from "@/actions/transaction";
import AddTransactionForm from "../_components/add-transaction";
import "../../../../components/hersection.css";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  // const editId =await searchParams?.edit ? String(searchParams.edit) : null; // Ensure it's a valid string
  const paramId= await searchParams;
  const editId= paramId.edit
  
  let initialData = null;
  if (editId) {
      initialData = await getTransaction(editId);
  }
  

  return (
    <div className="max-w-3xl mx-auto px-5 mt-20">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{editId? "Edit":"Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}