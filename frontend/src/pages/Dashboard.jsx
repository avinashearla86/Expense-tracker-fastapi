import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ExpenseForm from "../components/ExpenseForm";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      setEditingExpense(null);
    } catch (error) {
      console.error("Unauthorized or session expired:", error);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  if (loading) return <h3 className="loading">Loading your expenses...</h3>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2> My Expense Tracker</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-card">
        <ExpenseForm
          onAdd={fetchExpenses}
          onUpdate={fetchExpenses}
          initialData={editingExpense}
        />

        <div className="total-expenses">
          <h3>Total Expenses: ₹{totalExpenses}</h3>
        </div>

        <ul className="expense-list">
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses yet. Add your first one!</p>
          ) : (
            expenses.map((e) => (
              <li key={e.id} className="expense-item">
                <div className="expense-details">
                  <span className="expense-title">{e.title}</span>
                  <span className="expense-category">({e.category})</span>
                </div>
                <div className="expense-amount">₹{e.amount}</div>
                <div className="expense-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingExpense(e)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
