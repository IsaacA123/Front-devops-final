import React, { useState } from "react";
import {
  Clock,
  AlarmClock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
// import { Task, Priority } from '../types';
// import { useTaskStore } from '../store/taskStore';
import Modal from "./Modal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function TaskCard({
  task,
  showCheckbox = true,
  onEdit,
  onDelete,
}) {
  // const { updateTask, deleteTask } = useTaskStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({
    ...task,
    fecha_vencimiento: new Date(task.fecha_vencimiento).toISOString().split('T')[0]  // "2024-11-18"
  });
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleTaskCompletion = (completed: boolean) => {
    // updateTask(task.id, {
    //   completed,
    //   status: completed ? 'completed' : 'pending',
    // });
  };

  const onHandleEdit = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const onHandleDelete = async () => {
    setIsMenuOpen(false);
    if (confirm("¿Estas seguro que deseas eliminar esta tarea?")) {
      onDelete(task.id);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    // updateTask(task.id, editedTask);
    setIsEditModalOpen(false);
    onEdit(editedTask);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-start gap-4">
          {showCheckbox && (
            <button
              onClick={() => toggleTaskCompletion(!task.completed)}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded border ${
                task.completed
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-300"
              }`}
            >
              {task.completed && (
                <svg
                  className="w-full h-full text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4
                className={`font-medium ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-800"
                }`}
              >
                {task.titulo}
              </h4>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.prioridad
                  )}`}
                >
                  {task.prioridad}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={onHandleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={onHandleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p
              className={`text-sm mb-3 ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.descripcion}
            </p>
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(task.fecha_creacion, {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1">
                  <AlarmClock className="w-4 h-4" />
                  <span>
                    vence{" "}
                    {formatDistanceToNow(task.fecha_vencimiento, {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
                {task.prioridad === "alta" && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Prioridad</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  title="Editar Tarea"
>
  <form onSubmit={handleSaveEdit} className="space-y-3">
    {/* Título */}
    <div>
      <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
        Título
      </label>
      <input
        type="text"
        id="title"
        value={editedTask.titulo}
        onChange={(e) =>
          setEditedTask({ ...editedTask, titulo: e.target.value })
        }
        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none h-12"
        required
      />
    </div>

    {/* Descripción */}
    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
        Descripción
      </label>
      <textarea
        id="description"
        value={editedTask.descripcion}
        onChange={(e) =>
          setEditedTask({ ...editedTask, descripcion: e.target.value })
        }
        rows={3}
        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none resize-none"
      />
    </div>

    {/* Fecha de vencimiento */}
    <div>
      <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-1">
        Fecha de Vencimiento
      </label>
      <input
        type="date"
        id="dueDate"
        value={
          editedTask.fecha_vencimiento
            ? editedTask.fecha_vencimiento.slice(0, 10)
            : ""
        }
        onChange={(e) =>
          setEditedTask({
            ...editedTask,
            fecha_vencimiento: e.target.value,
          })
        }
        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
        required
      />
    </div>

    {/* Prioridad */}
    <div>
      <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
        Prioridad
      </label>
      <select
        id="priority"
        value={editedTask.prioridad}
        onChange={(e) =>
          setEditedTask({
            ...editedTask,
            prioridad: e.target.value,
          })
        }
        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
      >
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
    </div>

    {/* Botones */}
    <div className="flex justify-end space-x-4 pt-4">
      <button
        type="button"
        onClick={() => setIsEditModalOpen(false)}
        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        Guardar
      </button>
    </div>
  </form>
</Modal>

    </>
  );
}
