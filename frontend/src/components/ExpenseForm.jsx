import { useState, useEffect } from "react";
import API from "../api";

export default function ExpenseForm({ onAdd, onUpdate, initialData }) {
  const [expense, setExpense] = useState({ title: "", amount: "", category: "" });

  useEffect(() => {
    if (initialData) {
      setExpense(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...expense,
      amount: parseFloat(expense.amount),
    };

    if (initialData) {
      // Update existing expense
      await API.put(`/expenses/${initialData.id}`, dataToSend);
      onUpdate(); // Callback to refresh expense list or clear form
    } else {
      // Add new expense
      await API.post("/expenses", dataToSend);
      onAdd(); // Callback to refresh expense list
    }

    // Clear form after submission
    setExpense({ title: "", amount: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={expense.title}
        onChange={(e) => setExpense({ ...expense, title: e.target.value })}
      />
      <input
        placeholder="Amount"
        type="number"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
      />
      <input
        placeholder="Category"
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
      />
      <button type="submit">
        {initialData ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
