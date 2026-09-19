import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createEmployee, deleteEmployee, getEmployee, getEmployees, updateEmployee
} from "../api";
import type { Employee } from "../types";

const emptyEmployee: Omit<Employee, "id"> = {
  name: "", email: "", department: "", salary: 0, phone: "", joiningDate: ""
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyEmployee);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setEmployees(await getEmployees());
      setError("");
    } catch {
      setError("Unable to load employees. Check your API.");
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() =>
    employees.filter(e =>
      `${e.name} ${e.email} ${e.department}`.toLowerCase().includes(search.toLowerCase())
    ), [employees, search]);

  function change(key: keyof Omit<Employee, "id">, value: string) {
    setForm(prev => ({ ...prev, [key]: key === "salary" ? Number(value) : value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.department.trim() || form.salary <= 0) {
      setError("Name, email, department and a salary greater than 0 are required.");
      return;
    }

    try {
      if (editingId === null) {
        await createEmployee(form);
        setMessage("Employee created successfully.");
      } else {
        await updateEmployee(editingId, form);
        setMessage("Employee updated successfully.");
      }
      setForm(emptyEmployee);
      setEditingId(null);
      await load();
    } catch {
      setError("Operation failed. Verify the API endpoint and request model.");
    }
  }

  async function edit(id: number) {
    try {
      const employee = await getEmployee(id);
      setForm({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        salary: employee.salary,
        phone: employee.phone || "",
        joiningDate: employee.joiningDate || ""
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Unable to get employee details.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      setMessage("Employee deleted successfully.");
    } catch {
      setError("Delete failed.");
    }
  }

  function toggle(id: number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function bulkDelete() {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} selected employees?`)) return;
    for (const id of selected) {
      try { await deleteEmployee(id); } catch {}
    }
    setSelected([]);
    await load();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Employee Management</h2>
          <p className="muted">Create, update, search and delete employees.</p>
        </div>
        <button className="danger" onClick={bulkDelete} disabled={!selected.length}>
          Delete Selected ({selected.length})
        </button>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="card form-grid" onSubmit={submit}>
        <h3>{editingId === null ? "Add Employee" : `Edit Employee #${editingId}`}</h3>
        <input placeholder="Name" value={form.name} onChange={e => change("name", e.target.value)} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => change("email", e.target.value)} />
        <input placeholder="Department" value={form.department} onChange={e => change("department", e.target.value)} />
        <input type="number" placeholder="Salary" value={form.salary || ""} onChange={e => change("salary", e.target.value)} />
        <input placeholder="Phone" value={form.phone} onChange={e => change("phone", e.target.value)} />
        <input type="date" value={form.joiningDate} onChange={e => change("joiningDate", e.target.value)} />
        <div className="form-actions">
          <button className="primary">{editingId === null ? "Create" : "Update"}</button>
          {editingId !== null && <button type="button" onClick={() => {setEditingId(null); setForm(emptyEmployee)}}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <div className="toolbar">
          <input className="search" placeholder="Search name, email or department..." value={search} onChange={e => setSearch(e.target.value)} />
          <span>{filtered.length} record(s)</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr>
              <th></th><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Salary</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggle(e.id)} /></td>
                  <td>{e.id}</td><td>{e.name}</td><td>{e.email}</td><td>{e.department}</td>
                  <td>{Number(e.salary).toLocaleString()}</td>
                  <td className="actions">
                    <button onClick={() => edit(e.id)}>Edit</button>
                    <button className="danger-text" onClick={() => remove(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="empty">No employees found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}