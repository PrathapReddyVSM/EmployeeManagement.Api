import { useEffect, useState } from "react";
import { getEmployees } from "../api";
import type { Employee } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => { getEmployees().then(setEmployees).catch(() => setEmployees([])); }, []);

  const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const averageSalary = employees.length ? totalSalary / employees.length : 0;

  function exportPdf() {
    const doc = new jsPDF();
    doc.text("Employee Report", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Name", "Email", "Department", "Salary"]],
      body: employees.map(e => [e.id, e.name, e.email, e.department, String(e.salary)])
    });
    doc.save("employee-report.pdf");
  }

  return (
    <div>
      <div className="page-header">
        <div><h2>Reports</h2><p className="muted">Employee salary and department summary.</p></div>
        <button className="primary" onClick={exportPdf}>Export PDF</button>
      </div>
      <div className="stats">
        <div className="stat"><span>Total Employees</span><strong>{employees.length}</strong></div>
        <div className="stat"><span>Total Salary</span><strong>{totalSalary.toLocaleString()}</strong></div>
        <div className="stat"><span>Average Salary</span><strong>{averageSalary.toFixed(2)}</strong></div>
      </div>
      <div className="card">
        <h3>Department Summary</h3>
        {Object.entries(employees.reduce<Record<string, number>>((a, e) => {
          a[e.department] = (a[e.department] || 0) + 1; return a;
        }, {})).map(([department, count]) => (
          <div className="summary-row" key={department}><span>{department}</span><b>{count}</b></div>
        ))}
      </div>
    </div>
  );
}