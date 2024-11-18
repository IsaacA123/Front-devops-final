import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
import { CheckSquare } from "lucide-react";
import Modal from "./Modal";

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_vencimiento: Date;
  prioridad: string;
  estado: string;
}

const TasksView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/projects/${projectId}/tasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          toast.error(data?.message || "Error al cargar las tareas", {
            autoClose: 5000,
          });
          return;
        }

        const data = await response.json();
        setTasks(data.tasks);
        
      } catch (error: any) {
        toast.error("Error de red, intenta nuevamente", { autoClose: 7000 });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const columns = [
    { id: "pendiente", title: "Tareas Pendientes" },
    { id: "en_progreso", title: "En Progreso" },
    { id: "completada", title: "Completadas" },
  ];

  const getTasksByStatus = (status: string): Task[] =>
    tasks.filter((task) => task.estado === status);

  const onDragEnd = async (result: any) => {
    if (loading) {
      return;
    }
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        String(task.id) === draggableId
          ? { ...task, estado: destination.droppableId }
          : task
      );
    });

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/tasks/${draggableId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: destination.droppableId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data?.message || "Error al actualizar el estado", {
          autoClose: 5000,
        });
        setTasks((prevTasks) => {
          return prevTasks.map((task) =>
            String(task.id) === draggableId
              ? { ...task, estado: source.droppableId }
              : task
          );
        });
        return;
      }
      //toast.success("Estado actualizado", { autoClose: 2000 });
    } catch (error: any) {
      setTasks((prevTasks) => {
        return prevTasks.map((task) =>
          String(task.id) === draggableId
            ? { ...task, estado: source.droppableId }
            : task
        );
      });
      toast.error("Error de red, intenta nuevamente", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const onDeleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`,
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
        toast.error(data?.message || "Error al eliminar la tarea", {
          autoClose: 5000,
        });
        return;
      }
      setTasks((prevTasks) => {
        return prevTasks.filter((task) => task.id !== taskId);
      });
      
      toast.success(data?.message || "Tarea eliminada correctamente", {
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.error("Error de red, intenta nuevamente", { autoClose: 7000 });
    } finally {
      setLoading(false);
    }
  };

  const onEditTask = async (editedTask: Task) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/tasks/${editedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: editedTask.titulo,
            descripcion: editedTask.descripcion,
            fecha_vencimiento: editedTask.fecha_vencimiento,
            prioridad: editedTask.prioridad,
        }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Error al actualizar la tarea", {
          autoClose: 5000,
        });
       
        return;

      }
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        )
      );
      
      toast.success(data?.message || "Tarea actualizada correctamente", {
        autoClose: 5000,
      });
  
    } catch (error: any) {
      toast.error("Error de red, intenta nuevamente", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  }

  const onCreateTask= async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: newTask.titulo,
            descripcion: newTask.descripcion,
            fecha_vencimiento: newTask.fecha_vencimiento,
            prioridad: newTask.prioridad,
        }),
        }
      );

      const data = await response.json();      
      if (!response.ok) {
        toast.error(data?.message || "Error al crear la tarea", {
          autoClose: 5000,
        });
       
        return;

      }
            
      toast.success(data?.message || "Tarea creada correctamente", {
        autoClose: 5000,  
      });
  
    } catch (error: any) {
      toast.error("Error de red, intenta nuevamente", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4 p-4 h-full">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-1 bg-gray-50 rounded-lg p-4 min-h-[200px] md:min-h-[500px]"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center border-b border-gray-200 py-4">
                {column.title}
              </h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 h-full"
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={`${task.id}`}
                        draggableId={`${task.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // className="bg-white p-4 rounded shadow border border-gray-200"
                          >
                            <TaskCard
                              task={task}
                              showCheckbox={false}
                              onDelete={onDeleteTask}
                              onEdit={onEditTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {/* Botón de acción */}
      <ActionButton>
        <button
          onClick={() => {
            setIsEditModalOpen(true);
          }}
          className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50"
        >
          <CheckSquare className="w-5 h-5 text-gray-600" />
          <span className="ml-3 text-gray-700">Nueva tarea</span>
        </button>
      </ActionButton>
      {/* Modal de creación */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Crear una nueva Tarea"
      >
        <form onSubmit={onCreateTask} className="space-y-4">
          <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
        Título
      </label>
            <input
              type="text"
              id="title"
              value={newTask.titulo}
              onChange={(e) =>
                setNewTask({ ...newTask, titulo: e.target.value })
              }
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none h-12"
              required
            />
          </div>

          <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
        Descripción
      </label>
            <textarea
              id="description"
              value={newTask.descripcion}
              onChange={(e) =>
                setNewTask({ ...newTask, descripcion: e.target.value })
              }
              rows={3}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none resize-none"
              />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha limite
            </label>
            <input
              type="date"
              id="dueDate"
              value={
                newTask.fecha_vencimiento
                  ? newTask.fecha_vencimiento.slice(0, 10) 
                  : ""
              }
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  fecha_vencimiento: e.target.value, 
                })
              }
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prioridad
            </label>
            <select
              id="priority"
              value={newTask.prioridad}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
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
};

export default TasksView;
