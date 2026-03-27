import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { deleteProblem, getProblems, updateProblem } from "../lib/api";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState("");

  async function loadProblems() {
    const data = await getProblems();
    setProblems(data);
  }

  useEffect(() => {
    loadProblems();
  }, []);

  const topics = useMemo(
    () => [...new Set(problems.map((problem) => problem.topic).filter(Boolean))],
    [problems]
  );

  const filtered =
    filter === "all"
      ? problems
      : problems.filter((problem) => problem.topic === filter);

  const handleDelete = async (id) => {
    await deleteProblem(id);
    loadProblems();
  };

  const startEdit = (problem) => {
    setEditingId(problem.id);
    setEditTitle(problem.name);
    setEditTopic(problem.topic || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditTopic("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editTopic.trim()) {
      return;
    }

    await updateProblem(id, {
      name: editTitle.trim(),
      topic: editTopic.trim(),
    });

    cancelEdit();
    loadProblems();
  };

  return (
    <AppLayout>
      <div className="fade-up space-y-6 pb-20 md:pb-0">
        <div>
          <h2 className="font-display text-3xl font-bold">All Problems</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {problems.length} problems logged
          </p>
        </div>

        {topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === "all"
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
              }`}
            >
              All
            </button>
            {topics.map((topic) => (
              <button
                type="button"
                key={topic}
                onClick={() => setFilter(topic)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  filter === topic
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No problems yet. Start adding some!
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((problem) => {
              const isEditing = editingId === problem.id;

              return (
                <motion.div
                  key={problem.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-card p-4 group"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Problem title"
                        className="w-full rounded-xl bg-secondary/50 border border-border/50 h-10 px-4 outline-none"
                        autoFocus
                        onKeyDown={(event) =>
                          event.key === "Enter" ? saveEdit(problem.id) : null
                        }
                      />
                      <input
                        value={editTopic}
                        onChange={(event) => setEditTopic(event.target.value)}
                        placeholder="Topic"
                        className="w-full rounded-xl bg-secondary/50 border border-border/50 h-10 px-4 outline-none"
                        onKeyDown={(event) =>
                          event.key === "Enter" ? saveEdit(problem.id) : null
                        }
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(problem.id)}
                          className="p-1.5 rounded-md hover:bg-primary/15 text-primary transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {problem.topic || "General"}
                          </span>
                        </div>
                        <p className="font-medium truncate">{problem.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added{" "}
                          {new Date(problem.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1">
                          {Array.from({
                            length: Number(problem.total_revisions || 3),
                          }).map((_, index) =>
                            index < Number(problem.completed_revisions || 0) ? (
                              <CheckCircle2
                                key={index}
                                className="w-3.5 h-3.5 text-success"
                              />
                            ) : (
                              <Circle
                                key={index}
                                className="w-3.5 h-3.5 text-muted-foreground/40"
                              />
                            )
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => startEdit(problem)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-primary text-muted-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(problem.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive text-muted-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
