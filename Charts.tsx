import { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../api";
import type { Employee } from "../types";

export default function Charts() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => { getEmployees().then(setEmployees).catch(() => setEmployees([])); }, []);

  const departments = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach(e => map[e.department] = (map[e.department] || 0) + 1);
    return Object.entries(map);
  }, [employees]);

  const max = Math.max(...departments.map(x => x[1]), 1);

  return (
    <div>
      <h2>Employee Chart</h2>
      <p className="muted">Employee count by department.</p>
      <div className="card chart">
        {departments.map(([name, count]) => (
          <div className="bar-row" key={name}>
            <span>{name}</span>
            <div className="bar-track"><div className="bar" style={{ width: `${(count / max) * 100}%` }} /></div>
            <b>{count}</b>
          </div>
        ))}
        {!departments.length && <p>No data available.</p>}
      </div>
    </div>
  );
}