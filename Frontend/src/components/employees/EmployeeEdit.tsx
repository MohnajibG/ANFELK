/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import EmployeeForm from "../../components/employees/EmployeeForm";
import Alert from "../ui/Alert";
import LoadingState from "../ui/LoadingState";

import { getEmployeeById, updateEmployee } from "../../api/employee.api";

import type {
  Employee,
  EmployeeForm as EmployeeFormType,
} from "../../types/employee";

const EmployeeEdit = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchEmployee = async () => {
      if (!id) {
        return;
      }

      try {
        const data = await getEmployeeById(id);

        if (!cancelled) {
          setEmployee(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Impossible de charger l'employé");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchEmployee();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (form: EmployeeFormType) => {
    if (!id) {
      setError("Identifiant de l'employé introuvable");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateEmployee(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role: form.role,
        speciality: form.speciality ?? "Hair",
      });

      navigate(`/admin/employees/${id}`);
    } catch (error: any) {
      setError(error?.message ?? "Erreur modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-10">
        <LoadingState />
      </div>
    );
  }

  if (!employee) {
    return (
      <Alert variant="danger">{error || "Employé introuvable"}</Alert>
    );
  }

  const initialValues: EmployeeFormType = {
    firstName: employee.firstName,

    lastName: employee.lastName,

    email: employee.email,

    phone: employee.phone ?? "",

    role: employee.role,

    speciality: employee.speciality ?? "Hair",
  };

  return (
    <div className="w-full space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-3 text-sm"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <section className="rounded-3xl border border-(--border) bg-white p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Administration
          </p>

          <h1 className="mt-2 font-title text-3xl font-bold">
            Modifier l'employé
          </h1>

          <p className="mt-2 text-sm text-(--muted)">
            {employee.firstName} {employee.lastName}
          </p>
        </div>

        {error && (
          <div className="mb-5">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        <EmployeeForm
          initialValues={initialValues}
          loading={saving}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
};

export default EmployeeEdit;
