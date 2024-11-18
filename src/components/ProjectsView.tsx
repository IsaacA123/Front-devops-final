import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import Modal from "./Modal";
import {
  FolderOpen,
  Target,
} from "lucide-react";
import ActionButton from "./ActionButton";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: Date;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProject, setNewProject] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:4000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setProjects(data.projects || []);
        } else {
          toast.error(data?.message || "Error al obtener proyectos", {
            autoClose: 7000,
          });
          setErrorMessage(data.error?.[0] || "Error desconocido");
        }
      } catch (error) {
        toast.error("Error de red, intenta nuevamente", { autoClose: 7000 });
        setErrorMessage(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const onDeleteProject= async (projectId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Error al eliminar el proyecto", {
          autoClose: 5000,
        });
        return;
      }
      setProjects((prevProjects) => {
        return prevProjects.filter((projects) => projects.id !== projectId);
      });
      toast.success(data?.message || "Proyecto eliminado correctamente", {
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.error("Error de red, intenta nuevamente", { autoClose: 7000 });
    } finally {
      setLoading(false);
    }
  };

  const onEditProject = async (editedProject: Project) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${editedProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: editedProject.nombre,
            descripcion: editedProject.descripcion,
        }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Error al actualizar el proyecto", {
          autoClose: 5000,
        });
       
        return;

      }
      
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editedProject.id ? editedProject : project
        )
      );
      
      toast.success(data?.message || "Proyecto actualizado correctamente", {
        autoClose: 5000,
      });
  
    } catch (error: any) {      
      toast.error("Error de red, intenta nuevamente", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  }

  const onCreateProject = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: newProject.nombre,
            descripcion: newProject.descripcion,
        }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Error al crear el proyecto", {
          autoClose: 5000,
        });
       
        return;

      }
      
      setProjects(...projects, newProject);
      
      toast.success(data?.message || "Proyecto creado correctamente", {
        autoClose: 5000,
      });
  
    } catch (error: any) {      
      toast.error("Error de red, intenta nuevamente", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  }
  
  const onOpenProject = async (projectId: number) => {
    navigate(`/projects/${projectId}/tasks`)
  }

  return (
    <main className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Vista de Proyectos</h1>
        <p className="text-gray-600">
          Gestiona y organiza tus proyectos de forma eficiente.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
          key={project.id}
          className="flex-1 bg-gray-50 rounded-lg p-4 min-h-[200px] md:min-h-[200px]"
        >
         <ProjectCard
         project={project}
         onClick={onOpenProject}
         onEdit={onEditProject}
         onDelete={onDeleteProject}
         ></ProjectCard>
        </div>
        ))}
        {projects.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay proyectos todavía
            </h3>
            <p className="text-gray-500">
              Crea tu primer proyecto haciendo clic en +.
            </p>
          </div>
        )}
      </section>

      {/* Botón de acción */}
      <ActionButton >
        <button onClick={() => {    setIsEditModalOpen(true)}} 
        className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50">
          <FolderOpen className="w-5 h-5 text-gray-600" />
          <span className="ml-3 text-gray-700">Nuevo Proyecto</span>
        </button>
      </ActionButton>

      {/* Modal de creación */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Crear proyecto"
      >
        <form onSubmit={onCreateProject} className="space-y-4">
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
              value={newProject.nombre}
              onChange={(e) =>
                setNewProject({ ...newProject, nombre: e.target.value })
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
              value={newProject.descripcion}
              onChange={(e) =>
                setNewProject({ ...newProject, descripcion: e.target.value })
              }
              rows={3}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
              />
          </div>

         

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
      
    </main>
  );
};

export default Projects;
