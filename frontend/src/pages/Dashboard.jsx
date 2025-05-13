import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ExpenseForm from "../components/ExpenseForm";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      setEditingExpense(null); // Clear editing state after any update
    } catch {
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div>
      <h2>My Expenses</h2>

      <ExpenseForm
        onAdd={fetchExpenses}
        onUpdate={fetchExpenses}
        initialData={editingExpense}
      />

      <div className="total-expenses">
        <h3>Total Expenses: Rs {totalExpenses}</h3>
      </div>

      <ul className="expense-list">
        {expenses.map((e) => (
          <li key={e.id} className="expense-item">
            <span>{e.title} - Rs {e.amount} ({e.category})</span>
            <div style={{ display: "inline-block", marginLeft: "10px" }}>
              <button className="edit-btn" onClick={() => setEditingExpense(e)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(e.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
