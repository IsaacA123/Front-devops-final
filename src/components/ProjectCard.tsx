import { Clock, Edit2, MoreVertical, Target, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ProjectCard({ project, onClick, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const onHandleEdit = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const onHandleDelete = async () => {
    setIsMenuOpen(false);
    if (confirm("¿Estas seguro que deseas eliminar este proyecto y todas sus tareas?")) {
      onDelete(project.id);
    }
  };

  const onHandleOpen = async () => {
    onClick(project.id);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    onEdit(editedProject);
  };

  return (
    <>
      <button
        onClick={onHandleOpen}
        key={project.id}
        className="text-left block bg-white w-full rounded-lg drop-shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow"
      >
        {/* Header del proyecto */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              {project.nombre}
            </h3>
          </div>
          <div className="relative">
            <button
              onClick={(event) => {
                event.stopPropagation(); // Evita la propagación del evento
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(event) => {
                    event.stopPropagation(); // También aquí si es necesario
                    onHandleEdit();
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation(); // También aquí si es necesario
                    onHandleDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 mb-4">
          {project.descripcion || (
            <span className="italic">No hay descripción</span>
          )}
        </p>

        {/* Progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Fecha de creación */}
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            {formatDistanceToNow(new Date(project.fecha_creacion), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>
      </button>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar proyecto"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="title"
              value={editedProject.nombre}
              onChange={(e) =>
                setEditedProject({ ...editedProject, nombre: e.target.value })
              }
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={editedProject.descripcion}
              onChange={(e) =>
                setEditedProject({ ...editedProject, descripcion: e.target.value })
              }
              rows={3}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
              />
          </div>

         

          <div className="flex justify-end space-x-6 pt-4">
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
